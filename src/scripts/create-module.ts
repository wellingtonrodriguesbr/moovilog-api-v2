import fs from 'fs'
import path from 'path'

// Pega o nome do módulo dos argumentos da linha de comando
// process.argv[0] é 'node', process.argv[1] é o caminho do script
const moduleName = process.argv[2]

if (!moduleName) {
  console.error('Por favor, forneça um nome para o módulo.')
  console.log('Exemplo: npm run create-module NomeDoModulo')
  process.exit(1)
}

// Validação simples para o nome do módulo (opcional, mas recomendado)
if (!/^[a-zA-Z0-9]+$/.test(moduleName)) {
  console.error('O nome do módulo deve conter apenas letras e números.')
  process.exit(1)
}

// Caminho base para a pasta de módulos
const modulesBasePath = path.join(__dirname, '..', 'modules') // Assume que o script está em /scripts e src está na raiz
const modulePath = path.join(modulesBasePath, moduleName.toLowerCase()) // Padroniza para minúsculas

// Subpastas a serem criadas
const subfolders = ['application', 'domain', 'infra']

// Verifica se a pasta principal 'src/modules' existe
if (!fs.existsSync(path.join(__dirname, '..'))) {
  console.error("A pasta 'src' não foi encontrada na raiz do projeto.")
  process.exit(1)
}
if (!fs.existsSync(modulesBasePath)) {
  console.log(`A pasta 'src/modules' não existe. Criando...`)
  fs.mkdirSync(modulesBasePath, { recursive: true })
}

// Verifica se o módulo já existe
if (fs.existsSync(modulePath)) {
  console.error(`O módulo '${moduleName}' já existe em '${modulePath}'.`)
  process.exit(1)
}

try {
  // Cria a pasta principal do módulo
  fs.mkdirSync(modulePath, { recursive: true })
  console.log(`Pasta do módulo '${moduleName}' criada em: ${modulePath}`)

  // Cria as subpastas
  subfolders.forEach(folder => {
    const subfolderPath = path.join(modulePath, folder)
    fs.mkdirSync(subfolderPath)
    console.log(`Subpasta '${folder}' criada em: ${subfolderPath}`)
  })

  // Cria o arquivo index.ts
  const indexPath = path.join(modulePath, 'index.ts')
  // Conteúdo inicial para o index.ts (opcional)
  const indexContent = `// Exportações do módulo ${moduleName}\n\nexport {};\n`
  fs.writeFileSync(indexPath, indexContent)
  console.log(`  Arquivo 'index.ts' criado em: ${indexPath}`)

  console.log(`\nEstrutura do módulo '${moduleName}' criada com sucesso!`)
} catch (error) {
  console.error(`Erro ao criar a estrutura do módulo '${moduleName}':`, error)
  process.exit(1)
}
