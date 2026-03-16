import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cart = [];

function question(text) {
  return new Promise(resolve => rl.question(text, resolve));
}

function addProduct(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  console.log("✅ Produto adicionado ao carrinho!");
}

function removeProduct(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    cart.splice(index, 1);
    console.log("🗑 Produto removido!");
  } else {
    console.log("Produto não encontrado.");
  }
}

function updateQuantity(name, quantity) {
  const product = cart.find(item => item.name === name);

  if (product) {
    product.quantity = quantity;
    console.log("🔄 Quantidade atualizada!");
  } else {
    console.log("Produto não encontrado.");
  }
}

function showCart() {
  if (cart.length === 0) {
    console.log("\nCarrinho vazio.\n");
    return;
  }

  let total = 0;
  let totalItems = 0;

  console.log("\n🛒 Produtos no carrinho:\n");

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;

    console.log(
      `${item.name} | R$ ${item.price} | qtd: ${item.quantity} | subtotal: R$ ${subtotal}`
    );

    total += subtotal;
    totalItems += item.quantity;
  });

  console.log("\n----------------------");
  console.log(`Total de itens: ${totalItems}`);
  console.log(`Total a pagar: R$ ${total}`);
  console.log("----------------------\n");
}

async function menu() {
  while (true) {
    console.log(`
========= SHOPEE CART =========
1 - Adicionar produto
2 - Remover produto
3 - Alterar quantidade
4 - Ver carrinho
5 - Sair
`);

    const option = await question("Escolha uma opção: ");

    switch (option) {
      case "1":
        const name = await question("Nome do produto: ");
        const price = Number(await question("Preço: "));
        addProduct(name, price);
        break;

      case "2":
        const removeName = await question("Nome do produto para remover: ");
        removeProduct(removeName);
        break;

      case "3":
        const updateName = await question("Produto: ");
        const quantity = Number(await question("Nova quantidade: "));
        updateQuantity(updateName, quantity);
        break;

      case "4":
        showCart();
        break;

      case "5":
        console.log("👋 Obrigado por usar o Shopee Cart!");
        rl.close();
        process.exit();

      default:
        console.log("❌ Opção inválida.");
    }
  }
}

menu();
