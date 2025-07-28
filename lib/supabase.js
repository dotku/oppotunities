import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase = null
let fallbackData = null

// Initialize Supabase client
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('Supabase environment variables not found, using fallback data')
}

// Load fallback data
try {
  const dataPath = path.join(process.cwd(), 'api', 'opportunities.json')
  fallbackData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
} catch (error) {
  console.error('Error loading fallback data:', error)
  fallbackData = { opportunities: [], categories: [] }
}

export { supabase }

// Helper functions for opportunities
export const opportunitiesAPI = {
  // Get all opportunities with optional filtering
  async getAll(filters = {}) {
    if (!supabase) {
      // Use fallback data
      let filtered = [...fallbackData.opportunities]
      
      if (filters.category) {
        filtered = filtered.filter(op => op.category === filters.category)
      }
      if (filters.subcategory) {
        filtered = filtered.filter(op => op.subcategory === filters.subcategory)
      }
      if (filters.type) {
        filtered = filtered.filter(op => op.type === filters.type)
      }
      if (filters.company) {
        filtered = filtered.filter(op => op.company === filters.company)
      }
      
      return filtered
    }

    try {
      let query = supabase.from('opportunities').select('*')
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory)
      }
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.company) {
        query = query.eq('company', filters.company)
      }
      
      const { data, error } = await query
      if (error) {
        console.warn('Supabase error, using fallback data:', error.message)
        // Fall back to local data
        let filtered = [...fallbackData.opportunities]
        
        if (filters.category) {
          filtered = filtered.filter(op => op.category === filters.category)
        }
        if (filters.subcategory) {
          filtered = filtered.filter(op => op.subcategory === filters.subcategory)
        }
        if (filters.type) {
          filtered = filtered.filter(op => op.type === filters.type)
        }
        if (filters.company) {
          filtered = filtered.filter(op => op.company === filters.company)
        }
        
        return filtered
      }
      return data
    } catch (err) {
      console.warn('Database error, using fallback data:', err.message)
      return fallbackData.opportunities
    }
  },

  // Get opportunity by ID
  async getById(id) {
    if (!supabase) {
      const opportunity = fallbackData.opportunities.find(op => op.id === id)
      if (!opportunity) throw new Error('Opportunity not found')
      return opportunity
    }

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get opportunities by category
  async getByCategory(category) {
    if (!supabase) {
      return fallbackData.opportunities.filter(op => op.category === category)
    }

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('category', category)
    
    if (error) throw error
    return data
  },

  // Search opportunities
  async search(query) {
    if (!supabase) {
      const searchTerm = query.toLowerCase()
      return fallbackData.opportunities.filter(op => 
        op.title.toLowerCase().includes(searchTerm) ||
        op.company.toLowerCase().includes(searchTerm) ||
        op.description.toLowerCase().includes(searchTerm) ||
        (op.skills && op.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
      )
    }

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .or(`title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%,skills.cs.{${query}}`)
      
      if (error) {
        console.warn('Supabase search error, using fallback:', error.message)
        const searchTerm = query.toLowerCase()
        return fallbackData.opportunities.filter(op => 
          op.title.toLowerCase().includes(searchTerm) ||
          op.company.toLowerCase().includes(searchTerm) ||
          op.description.toLowerCase().includes(searchTerm) ||
          (op.skills && op.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
        )
      }
      return data
    } catch (err) {
      console.warn('Search error, using fallback:', err.message)
      const searchTerm = query.toLowerCase()
      return fallbackData.opportunities.filter(op => 
        op.title.toLowerCase().includes(searchTerm) ||
        op.company.toLowerCase().includes(searchTerm) ||
        op.description.toLowerCase().includes(searchTerm) ||
        (op.skills && op.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
      )
    }
  },

  // Get all categories
  async getCategories() {
    if (!supabase) {
      return fallbackData.categories || []
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
      
      if (error) {
        console.warn('Supabase error, using fallback categories:', error.message)
        return fallbackData.categories || []
      }
      return data
    } catch (err) {
      console.warn('Database error, using fallback categories:', err.message)
      return fallbackData.categories || []
    }
  },

  // Get companies
  async getCompanies() {
    if (!supabase) {
      return [...new Set(fallbackData.opportunities.map(op => op.company))]
    }

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('company')
        .order('company')
      
      if (error) {
        console.warn('Supabase error, using fallback companies:', error.message)
        return [...new Set(fallbackData.opportunities.map(op => op.company))]
      }
      return [...new Set(data.map(item => item.company))]
    } catch (err) {
      console.warn('Database error, using fallback companies:', err.message)
      return [...new Set(fallbackData.opportunities.map(op => op.company))]
    }
  },

  // Get statistics
  async getStats() {
    const [opportunities, categories] = await Promise.all([
      this.getAll(),
      this.getCategories()
    ])

    const categoryCounts = opportunities.reduce((acc, opp) => {
      acc[opp.category] = (acc[opp.category] || 0) + 1
      return acc
    }, {})

    const companies = [...new Set(opportunities.map(opp => opp.company))]
    const locations = [...new Set(opportunities.map(opp => opp.location))]

    return {
      totalOpportunities: opportunities.length,
      totalCategories: categories.length,
      totalCompanies: companies.length,
      totalLocations: locations.length,
      categoryCounts,
      companies,
      locations
    }
  }
}