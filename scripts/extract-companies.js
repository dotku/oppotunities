const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

async function extractCompaniesFromExcel() {
  try {
    // Read the Excel file
    const filePath = path.join(
      __dirname,
      "../public/data/美国可sponsor公司白名单&薪资情况.xlsx"
    );
    const workbook = XLSX.readFile(filePath);

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    console.log("Raw data sample:", rawData.slice(0, 3));
    console.log("Total rows:", rawData.length);
    console.log("Column headers:", Object.keys(rawData[0] || {}));

    // Process and clean the data
    const companies = rawData
      .map((row, index) => {
        // Try to identify common column patterns
        const possibleNameColumns = [
          "Company",
          "Company Name",
          "公司名称",
          "Name",
          "Employer",
        ];
        const possibleSponsorColumns = [
          "Sponsor",
          "Sponsor Number",
          "H1B",
          "Sponsors",
          "赞助数量",
        ];
        const possibleSalaryColumns = [
          "Salary",
          "Average Salary",
          "平均薪资",
          "Wage",
          "Pay",
        ];

        let companyName = "";
        let sponsorCount = 0;
        let averageSalary = "";

        // Find company name
        for (const col of possibleNameColumns) {
          if (row[col]) {
            companyName = String(row[col]).trim();
            break;
          }
        }

        // If no standard column found, try first column
        if (!companyName) {
          const firstKey = Object.keys(row)[0];
          companyName = String(row[firstKey] || "").trim();
        }

        // Find sponsor count
        for (const col of possibleSponsorColumns) {
          if (row[col] !== undefined && row[col] !== null) {
            const value = String(row[col]).replace(/[^\d]/g, "");
            if (value) {
              sponsorCount = parseInt(value) || 0;
              break;
            }
          }
        }

        // Find salary info
        for (const col of possibleSalaryColumns) {
          if (row[col]) {
            averageSalary = String(row[col]).trim();
            break;
          }
        }

        return {
          id: `company_${index + 1}`,
          name: companyName,
          sponsorCount: sponsorCount,
          averageSalary: averageSalary,
          canSponsorVisa: sponsorCount > 0,
          industry: "", // Can be filled later
          location: "", // Can be filled later
          website: "", // Can be filled later
          rawData: row, // Keep original data for reference
        };
      })
      .filter((company) => company.name && company.name.length > 0);

    // Sort by sponsor count (highest first)
    companies.sort((a, b) => b.sponsorCount - a.sponsorCount);

    console.log(`\nProcessed ${companies.length} companies`);
    console.log("Top 5 companies by sponsor count:");
    companies.slice(0, 5).forEach((company) => {
      console.log(`- ${company.name}: ${company.sponsorCount} sponsors`);
    });

    // Save to JSON file
    const outputPath = path.join(__dirname, "../public/data/companies.json");
    const companiesData = {
      companies: companies,
      metadata: {
        source: "美国可sponsor公司白名单&薪资情况.xlsx",
        extractedAt: new Date().toISOString(),
        totalCompanies: companies.length,
        topSponsorCount: companies[0]?.sponsorCount || 0,
      },
    };

    fs.writeFileSync(outputPath, JSON.stringify(companiesData, null, 2));
    console.log(`\nCompanies data saved to: ${outputPath}`);

    // Also create a simplified version for API
    const simplifiedCompanies = companies.map(
      ({ rawData, ...company }) => company
    );
    const apiDataPath = path.join(__dirname, "../api/companies.json");
    fs.writeFileSync(
      apiDataPath,
      JSON.stringify(
        {
          companies: simplifiedCompanies,
          metadata: companiesData.metadata,
        },
        null,
        2
      )
    );
    console.log(`Simplified API data saved to: ${apiDataPath}`);

    return companies;
  } catch (error) {
    console.error("Error extracting companies:", error);
    throw error;
  }
}

// Run the extraction
if (require.main === module) {
  extractCompaniesFromExcel()
    .then(() => {
      console.log("\n✅ Company extraction completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Company extraction failed:", error);
      process.exit(1);
    });
}

module.exports = { extractCompaniesFromExcel };
