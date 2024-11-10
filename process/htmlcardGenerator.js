// Fonction révisée pour transformer le texte de carte en HTML
function transformCardText(text) {
    const lines = text.split('//');
    let htmlContent = '<div class="card-text" style="top:20px;">';

    lines.forEach(line => {
        let formattedLine = '';

        // Détecte les bonus en gras avec grande police
        if (line.match(/^\|\+\d+ (Carte|Actions)/)) {
            formattedLine += `<div style="font-weight: bold;"><div style="display:inline;"><div style="display:inline; font-size:28px;">${line}</div></div><br></div>`;
        }
        // Détecte les séparateurs "—" et ajoute une ligne horizontale
        else if (line.trim() === "---") {
            formattedLine += '<div class="horizontal-line" style="width:200px; height:3px;margin-top:10px;"></div>';
        }
        // Détecte les valeurs entre crochets pour insérer une icône
        else if (line.match(/\[\d\]/)) {
            const value = line.match(/\[(\d)\]/)[1];
            formattedLine += `<div style="display:inline;"><div style="display:inline; font-size:20px;">${line.replace(/\[\d\]/, '')}</div></div><br>`;
            formattedLine += `<div class="card-text-coin-icon" style="transform:scale(0.22); top:30px; display: inline; left:140px;"><div class="card-text-coin-text-container" style="display:inline;"><div class="card-text-coin-text" style="color: black; display:inline; top:8px;">${value}</div></div></div>`;
        }
        // Ajoute chaque ligne standard sans format spécial
        else {
            formattedLine += `<div style="display:inline;"><div style="display:inline; font-size:20px;">${line}</div></div><br>`;
        }

        htmlContent += formattedLine;
    });

    htmlContent += '</div>';
    return htmlContent;
}

// Test de transformation sur un exemple complexe
const test_card_text = "|+1 Carte|//|+2 Actions|//---//Quand vous recevez cette carte,//recevez une carte moins chère.";
const transformed_html = transformCardText(test_card_text);

console.log(transformed_html);
