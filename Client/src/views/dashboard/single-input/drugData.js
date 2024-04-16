const csvFilePath = '/HL6_one.csv';

function processData(csvText) {
    // console.log(csvText);
    const drugData = [];
    const uniqueAnalytes = new Set();

    // Parse the CSV text
    const rows = csvText.split('\n');
    const header = rows[0].split(',');

    let idCounter = 1; // Initialize an ID counter

    for (let i = 1; i < rows.length; i += 1) {
        const values = rows[i].split(',');

        if (values.length === header.length) {
            const AnalyteIndex = header.indexOf('Analyte');
            const CASIndex = header.indexOf('CAS');

            const Analyte = values[AnalyteIndex];
            const CAS = values[CASIndex];

            if (Analyte && CAS) {
                if (!uniqueAnalytes.has(Analyte)) {
                    uniqueAnalytes.add(Analyte);

                    drugData.push({
                        id: (idCounter += 1), // Increment the ID counter
                        name: Analyte,
                        cas: CAS
                    });
                }
            }
        }
    }

    return drugData; // Return the drugData array
}

// Export a function that returns a promise to fetch and process the data
export async function fetchAndProcessData() {
    try {
        const response = await fetch(csvFilePath);
        const csvText = await response.text();
        const drugData = processData(csvText);
        return drugData;
    } catch (error) {
        console.error('Error loading or processing the CSV file:', error);
        return []; // Return an empty array in case of an error
    }
}
