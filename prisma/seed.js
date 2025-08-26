const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding process...')
  
  const dataDir = path.join(__dirname, 'cardData')
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))
  
  console.log(`📁 Found ${files.length} deck file(s) to process: ${files.join(', ')}`)

  for (const file of files) {
    console.log(`\n🔄 Processing file: ${file}`)
    
    const { deckName, description, cards } = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), 'utf-8')
    )
    
    console.log(`📋 Deck "${deckName}" contains ${cards.length} cards`)

    // 1. Upsert deck
    console.log(`🗃️  Creating/updating deck: "${deckName}"`)
    const deck = await prisma.deck.upsert({
      where: { name: deckName },
      update: {},
      create: { name: deckName, description },
    })
    console.log(`✅ Deck "${deckName}" successfully created/updated (ID: ${deck.id})`)

    // 2. Bulk create cards
    console.log(`🎴 Creating ${cards.length} tarot cards for deck "${deckName}"`)
    const result = await prisma.tarotCard.createMany({
      data: cards.map((c) => ({ ...c, deckId: deck.id })),
      skipDuplicates: true,
    })
    console.log(`✅ Successfully created ${cards.length} tarot cards for deck "${deckName}"`)

    console.log(`🎉 Seeded ${cards.length} cards into "${deckName}"`)
  }

  console.log('\n🎊 Database seeding completed successfully!')
  console.log(`📊 Total decks processed: ${files.length}`)
  
  await prisma.$disconnect()
  console.log('🔌 Database connection closed')
}

main().catch(e => {
  console.error(e)
  prisma.$disconnect().finally(() => process.exit(1))
})