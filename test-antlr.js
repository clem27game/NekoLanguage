const antlr4 = require('antlr4');
console.log("antlr4 structure:");
console.log(Object.keys(antlr4));

// Check if atn exists
if (antlr4.atn) {
    console.log("atn exists");
    console.log(Object.keys(antlr4.atn));
} else {
    console.log("atn does not exist");
}

// Look for ATNDeserializer
for (const key in antlr4) {
    if (key === 'ATNDeserializer' || key.includes('Deserializer')) {
        console.log(`Found: ${key}`);
    }
}