function tokenExist(session) {
    const fs = require('fs');

    const pastaASerVerificada = `tokens/session-${session}`;

    try {
        // Tenta verificar a existência da pasta
        fs.accessSync(pastaASerVerificada, fs.constants.F_OK);
        return true; // A pasta existe
    } catch (err) {
        return false; // A pasta não existe
    }


}

function allTokensExist() {
    const fs = require('fs');
    const path = require('path');

    const pastaASerVerificada = 'tokens'; // Pasta que você deseja verificar

    try {
      const files = fs.readdirSync(pastaASerVerificada);
  
      // Filtrar pastas que começam com "session"
      const sessionFolders = files.filter(file => {
        const fullPath = path.join(pastaASerVerificada, file);
        return fs.statSync(fullPath).isDirectory() && file.startsWith('session');
      });
  
      return sessionFolders;
    } catch (err) {
      return []; // Erro ao ler o diretório ou nenhuma pasta "session" encontrada
    }


}

async function setTextForResultados(conteudo) {
    const caminhoDoArquivo = 'msg_resultados.txt';
    const fs = require('fs').promises;

    try {
        const conteudoFormatado = conteudo.replace(/\n/g, '\r\n');

        await fs.writeFile(caminhoDoArquivo, conteudoFormatado, 'utf8');

        return true;
    } catch (erro) {
        throw erro;
    }
}

async function getDestinos(session) {
    const fs = require('fs').promises;

    try {
        const dados = await fs.readFile('destinos.json', 'utf8');
        const objetoJSON = JSON.parse(dados);

        const objSession = objetoJSON[session];

        return objSession;
    } catch (erro) {
        throw erro;
    }
}

async function setDestinos(session, novosDestinos) {
    const fs = require('fs').promises;

    try {
        const dados = await fs.readFile('destinos.json', 'utf8');
        const objetoJSON = JSON.parse(dados);

        const objSession = objetoJSON[session];

        objSession.destinos = novosDestinos;

        await fs.writeFile('destinos.json', JSON.stringify(objetoJSON, null, 2), 'utf8');
    } catch (erro) {
        throw erro;
    }
}

async function deleteTokenResultados(session) {
    const fs = require('fs').promises;

    const pastaASerVerificada = `tokens/${session}`;

    try {
        const stats = await fs.stat(pastaASerVerificada);

        if (stats.isDirectory()) {

            // Agora, exclua o diretório
            await fs.rmdir(pastaASerVerificada, { recursive: true, force: true });
            console.log(`Pasta ${pastaASerVerificada} foi excluída.`);
        } else {
            console.log('O caminho não é um diretório.');
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`A pasta ${pastaASerVerificada} não existe.`);
        } else {
            console.error('Erro ao verificar ou excluir a pasta:', err);
        }
    }
}

async function getTextForResultados() {
    const caminhoDoArquivo = 'msg_resultados.txt';
    const fs = require('fs').promises;

    try {
        const dados = await fs.readFile(caminhoDoArquivo, 'utf8');

        // Substitua as quebras de linha pelo caractere '\n'
        const conteudoFormatado = dados.replace(/\r\n/g, '\n');

        return conteudoFormatado;
    } catch (erro) {
        throw erro;
    }
}

module.exports = {
    tokenExist,
    allTokensExist,
    setTextForResultados,
    getDestinos,
    setDestinos,
    deleteTokenResultados,
    getTextForResultados,
};