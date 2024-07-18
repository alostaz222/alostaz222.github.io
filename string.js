function extractTextAfterSymbols(str, symbols, variables) {
    const result = {};
    symbols.forEach((symbol, index) => {
        const variableName = variables[index];
        if (str.includes(symbol)) {
            const parts = str.split(symbol);
            let textAfterSymbol = parts[1];
            for (let i = 0; i < textAfterSymbol.length; i++) {
                if (symbols.includes(textAfterSymbol[i])) {
                    textAfterSymbol = textAfterSymbol.slice(0, i);
                    break;
                }
            }
            result[variableName] = textAfterSymbol.trim();
        } else {
            result[variableName] = "";
        }
    });
    return result;
}

// Example usage
const inputString = "Hello!John@Group1#SessionA$TypeX";
const symbols = ['!', '@', '#', '$'];
const variables = ['name', 'group', 'session', 'type'];
const result = extractTextAfterSymbols(inputString, symbols, variables);
console.log(result); // { name: 'John', group: 'Group1', session: 'SessionA', type: 'TypeX' }