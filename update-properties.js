const axios = require('axios');

// Configurações da API do GitHub
const GITHUB_API_URL = 'https://api.github.com';
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const TOKEN = process.env.TOKEN;
const CUSTOM_PROPERTIES_URL = `${GITHUB_API_URL}/repos/${OWNER}/${REPO}/custom_properties`;

console.log(CUSTOM_PROPERTIES_URL)

// Nomes e valores das propriedades personalizadas passadas via inputs
const customProperties = {
  [process.env.CUSTOM_PROPERTY1_NAME]: process.env.CUSTOM_PROPERTY1_VALUE,
  [process.env.CUSTOM_PROPERTY2_NAME]: process.env.CUSTOM_PROPERTY2_VALUE,
};

// Função para obter as propriedades atuais
async function getCurrentProperties() {
  try {
    const response = await axios.get(CUSTOM_PROPERTIES_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter propriedades atuais:', error.response.data);
    throw error;
  }
}

// Função para atualizar as propriedades
async function updateProperties(newProperties) {
  try {
    const response = await axios.patch(CUSTOM_PROPERTIES_URL, newProperties, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar propriedades:', error.response.data);
    throw error;
  }
}

// Função principal para verificar e atualizar propriedades
async function verifyAndUpdateProperties(newProperties) {
  try {
    const currentProperties = await getCurrentProperties();
    
    // Verificar se há mudanças
    const propertiesToUpdate = {};
    let hasChanges = false;
    for (const key in newProperties) {
      if (newProperties[key] !== currentProperties[key]) {
        propertiesToUpdate[key] = newProperties[key];
        hasChanges = true;
      }
    }

    // Atualizar propriedades se houver mudanças
    if (hasChanges) {
      const updatedProperties = await updateProperties(propertiesToUpdate);
      console.log('Propriedades atualizadas com sucesso:', updatedProperties);
    } else {
      console.log('Nenhuma atualização necessária. Propriedades já estão atualizadas.');
    }
  } catch (error) {
    console.error('Erro ao verificar e atualizar propriedades:', error.message);
  }
}

// Executar a função
verifyAndUpdateProperties(customProperties);
