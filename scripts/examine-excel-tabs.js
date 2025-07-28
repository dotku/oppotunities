const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

async function examineExcelTabs() {
  try {
    console.log("📊 Examining Excel file tabs...");

    const excelPath = path.join(
      process.cwd(),
      "public/data/美国可sponsor公司白名单&薪资情况.xlsx"
    );

    if (!fs.existsSync(excelPath)) {
      console.error("❌ Excel file not found:", excelPath);
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);

    console.log(
      `\n📋 Found ${workbook.SheetNames.length} sheets in the Excel file:`
    );
    workbook.SheetNames.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    // Focus on the 2nd tab (index 1)
    if (workbook.SheetNames.length < 2) {
      console.log("❌ No 2nd tab found in the Excel file");
      return;
    }

    const secondTabName = workbook.SheetNames[1];
    console.log(`\n🎯 Examining 2nd tab: "${secondTabName}"`);

    const worksheet = workbook.Sheets[secondTabName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📊 Found ${rawData.length} rows of data in the 2nd tab`);

    if (rawData.length > 0) {
      // The first row contains the actual headers
      const headerRow = rawData[0];
      console.log("\n📋 Detected column headers from first row:");
      Object.entries(headerRow).forEach(([key, value], index) => {
        console.log(`  ${key} → "${value}"`);
      });

      // Extract the actual data (skip header row)
      const dataRows = rawData.slice(1);
      console.log(
        `\n📄 Processing ${dataRows.length} data rows (excluding header)`
      );

      // Process the data with proper column mapping
      const processedData = dataRows
        .map((row, index) => {
          // Convert LCA count to number (remove commas if present)
          let lcaCount = 0;
          if (row.__EMPTY_3) {
            if (typeof row.__EMPTY_3 === "string") {
              lcaCount = parseInt(row.__EMPTY_3.replace(/,/g, "")) || 0;
            } else {
              lcaCount = parseInt(row.__EMPTY_3) || 0;
            }
          }

          // Convert salary to number
          let averageSalary = 0;
          if (row.__EMPTY_4) {
            averageSalary = parseInt(row.__EMPTY_4) || 0;
          }

          return {
            rank: parseInt(row.__EMPTY_1) || index + 1,
            company: String(row.__EMPTY_2 || "Unknown Company").trim(),
            lcaCount: lcaCount,
            averageSalary: averageSalary,
          };
        })
        .filter(
          (item) =>
            item.company &&
            item.company !== "Unknown Company" &&
            item.company !== ""
        );

      console.log(
        `\n✅ Successfully processed ${processedData.length} valid company records`
      );

      console.log("\n📄 Sample processed data (first 5 companies):");
      console.log("=".repeat(80));

      processedData.slice(0, 5).forEach((company, index) => {
        console.log(`\n${index + 1}. Rank: ${company.rank}`);
        console.log(`   Company: ${company.company}`);
        console.log(`   LCA Count: ${company.lcaCount.toLocaleString()}`);
        console.log(
          `   Average Salary: $${company.averageSalary.toLocaleString()}`
        );
        console.log("-".repeat(40));
      });

      // Data analysis
      console.log("\n📊 Data Analysis:");
      console.log(`   Total Companies: ${processedData.length}`);

      // LCA count analysis
      const lcaCounts = processedData
        .map((c) => c.lcaCount)
        .filter((count) => count > 0);

      if (lcaCounts.length > 0) {
        const maxLCA = Math.max(...lcaCounts);
        const minLCA = Math.min(...lcaCounts);
        const avgLCA = Math.round(
          lcaCounts.reduce((a, b) => a + b, 0) / lcaCounts.length
        );
        console.log(
          `   LCA Count Range: ${minLCA.toLocaleString()} - ${maxLCA.toLocaleString()} (avg: ${avgLCA.toLocaleString()})`
        );
      }

      // Salary analysis
      const salaries = processedData
        .map((c) => c.averageSalary)
        .filter((salary) => salary > 0);
      if (salaries.length > 0) {
        const maxSalary = Math.max(...salaries);
        const minSalary = Math.min(...salaries);
        const avgSalary = Math.round(
          salaries.reduce((a, b) => a + b, 0) / salaries.length
        );
        console.log(
          `   Salary Range: $${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()} (avg: $${avgSalary.toLocaleString()})`
        );
      }

      // Save processed data
      const outputPath = path.join(
        process.cwd(),
        "public/data/processed-rankings.json"
      );
      const outputData = {
        sheetName: secondTabName,
        lastUpdated: new Date().toISOString(),
        totalCompanies: processedData.length,
        headers: {
          rank: headerRow.__EMPTY_1,
          company: headerRow.__EMPTY_2,
          lcaCount: headerRow.__EMPTY_3,
          averageSalary: headerRow.__EMPTY_4,
        },
        rankings: processedData,
      };

      fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
      console.log(`\n💾 Processed data saved to: ${outputPath}`);

      return processedData;
    } else {
      console.log("❌ No data found in the 2nd tab");
    }
  } catch (error) {
    console.error("❌ Error examining Excel file:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  examineExcelTabs()
    .then(() => {
      console.log("\n🎉 Excel examination completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Excel examination failed:", error);
      process.exit(1);
    });
}

module.exports = { examineExcelTabs };
