 implement a admin ecommerce  panel for web with nextjs all placed in folder
   'clubdeofertas.online-ADMIN', and use for this a initial template paste inside this
   folder and connected with 'clubdeofertas.online-FRONT' folder, use as same designs
   ans styles of this project, but to implement all system, navigate  in web page
   'https://clubdeofertas2.maxtiendas.com/mt-admin/login'  with user
   'juanvi92@icloud.com' and password 'Alvimerpy2025', stay loged  and access all pages
   and routes, pagination, explore all function and functionalities, schemes, links,
   buttons, and create a nextjs app, placed 'clubdeofertas.online-admin' folder , and
   change all code this nextjs project to adapt a funtionalities as the same code
   explored of one web  ecommerce admin page, and using as products, the 'product.json
   database', placed in a 'database' folder inside this , and product images, placed in
   a public/images folder, an construct a beautifull admin panel just clone of this
   web page explored.

   acces this web site 'https://experience-club.online/' and search all products in all routes and all produts
   detail paginations, and download all product informations, as image of product, name, description, 
  price, brand, details, product availability, etc...; and in your search to correct reurn most then 250 
  products, download all images and place this in ''scrap'' folder in scrap/public/images and insert 
  another object product in scrap/database/products.json in object name "ÏMAGEM" and complete anothers 
  details of this product as, first increment in one decimal number 'ID' if inited in a model take the last
   value with, for example,  ID: ''12000''', the next is 12001; place your category (Categoias) as 
  "CATEGORIA", name as "NOME", description as "DESCRICAO", price as PRECO_VENTA, specifications as 
  "ESPECIFICACAO", brand as "MARCA", availability in "DEISPONIBILIDADE", tags 

  analyze and testing all functions of server in @backend/  folder, admin @admin/
  folder, frontend in @frontend/ folder, running all with docker compose and as
  the same to testing postgres database, migrate and seed

summarize all operations performed, so far and save
  them in the file CLAUDE.md

  change all old products object names to a new references in a products.json in @frontend/
  database using this news to change references for fields Product
  'ID': 'id',
  'CATEGORIA': 'category',
  'NOME': 'name',
  'DISPONIBILIDADE': 'stockStatus',
  'REF': 'referenceId',
  'TAGS': 'tags',
  'marca': 'Brand',
  'DESCRICAO': 'description',
  'ESPECIFICACAO': 'specifications',
  'DESCRICAO_COMPLETA': 'details',
  'PRECO': 'price',
  'PRECO_VENTA': 'price_sale',
  'IMAGEM': 'images', for sxample old object name ID => changit to id, etc, and change to
  all references to products.json in @frontend/ folder and all nextjs code too, and running
  dev mode to testing to verify for issues, and fixit.


  create a api products gateway, if not exist, and perform all controllers operations with
  a swagger api and autentications, and pricipally the products create, update by value,
  update by colunm where value,get by value, get by id, get by columm where value, delete
  by id, delete by value, delete by colunm whre value, and pricipally, get all, get all
  with paginations, all with autentications.


  test last operations performed an summarize in claude.md, and change all products
  charging in @frontend/ nextjs app, over products.json in @frontend/database/ folder, to
  use now, products api gateway and products pagination, for all in frontend app, and not
  use anymore, products.json, with pagination;
  testing all operations performed, and summarize in claude.md

  convert docker-compose.yml in a docker swarm file with traefik, but labes adn traefik configs are commented, and domains is pgadmin =>                                │
│   pgadmin.clubdeofertas.online, backend => api.clubdeofertas.online, admin => admin.clubdeofertas.online, frontend => clubdeofertas.online 

change all process of login, register and save productsin cart, checkout, add wishlist, and
  monitore all transactions over admin panel, for this:
  in @backend create a new schema in prisma with table name wishlist and cart
    and checkout, all for using in a ecommerce, create all fields of thats table,
    to using with user table and products table references, with your services and
    controlers, with swagger and expose this over api gateway with same
    authorization of product api gateway, and imprement your use in admin, with
    all procedures to login over api, as the same in @frontend/ with login and
    register account, alls using api and login in admin too, and finnaly testing all changes
  in docker containers are running.

  analyze all @frontend auth code, and verify if register form ocurre
  with sucess, and show one message card "'Regitdado con Sucesso'in
  green, or 'No Registrado' in red color, and after registered with
  succes, testing if your page redirect to login, and testing in after
  login you receive jwt token to access and redirected to a dashboard
  page, verify if dashboard page inited with success, showing all user
  profile, orders, cart, wishlist, etc, all with testing verifying if
  receive correct code in html of current page, and not only 200 code,
  testin all register, testing login, testing dashboard, and fix all
  issues 


  in @frontend/ in dashboard page in profile in text edits, name,email, Rol,Miembro desde, change
  all text to color gray, in products card increase the text size guaranies price  Gs and values
  to the same size of uss price size, in details page beside the name of products, the red heart,
  call api and insert this product in wishlist database of this current user, as the same in this
  details page when pressed 'Agregar al Carrito' insert in Cart product database and when ocorre
  this with sucess show one small message card 'Suceso' green, as the same with buton in products
  card 'Agregar al Carrito' button, the same when in products cards press 'Comprar Ahora' increase
  all products in User Cart Database; increase 2x the sizes of icon red heart beside search bar
  in header menu, as the same with Cart icon, but when login of user, retrive the products
  quantities in the cart and update the green value in top of cart icon with this value, and when
  press the red heart beside this cart, go to the wishlist and upload all products in wish list
  user and display in this page.


  @admin is a administration panel of ecommerce, in your side bar Productos, show all products existent in a database over API of @backend, fixit to call API, and show all 
products over pagination, and your submenu, list product, add product, and show categories, brands. as the same with Clients => Users of API, and in dashboard show over API too 
Total of Products, total of Orders, total of Clients, and Total of order Amounts. all over API. changit and testing the HTML respose to show correct page and nothing Application 
error: a client-side exception has occurred (see the browser console for more information).after this rebuild docker and up this for concrete test
change all csv references to use API,  and testing all pages response in HTML,
  rebuilding admin and fixit errors

  and teestin HTML 
return for this pages, and only finish this fixit if to be sure then how 
corrected 

in @admin is a ecommerce panel to show products as Productos, orders as Pedidos , categoriesas Categorias
  , brands as Marcas, clients as Users, analyze very well this route /products is WORKS FINE, but the route
  orders and customers only response with error to loading clients or orders, based in ''Products'route
  search this 2 routes to fix use and response over API, and test this pages verifying the HTML return and
  not only status code 200, only finish all, to  be completely sure that everything and only finish finish
  everything and fix the errors after you are sure of this.TESTIwhen you visit these pages in a real browser, not just HTTP status codes.NG WITH 

  este projeto funciona normalmente rodando em mode desenvolvimento e localmente, uso docker-compose.dev.yml para rodar, variaveis de ambiente .env na pasta backend, .env na pasta frontend, variaveis .env pasta admin, e .env na pasta raiz, o backend expoe a porta 3062, o front a porta 3060, o admin a port 3061, o banco postgres a porta 155432, e uso o script setup.sh para instalar, migrar a base de dadoe e dar seed na base de dados. tudo funcionando perfeitamente !!! mas quando coloco este sintema para rodar em um servidor remoto com ip 217.79.189.223, acessando a pagina do frontend, recibo a mensagem error loading products, network error, try again, e nada aparece no front, mas se eu subo meu backend localmente e acesso o navegador, tudo funciona como se deveria, mas o stack usa o meu servidor local como API. quero que analize todo o sistema, os arquivos .env de todas as paras, o docker-compose.dev.yml e o script setup.sh, MUITO PROFUNDAMENTE,e gere um docker-composer.prod.yml, um setup-prod.yml, arquivos .env-prod para todas as pastas, e deixe todas as portas que estavam exposta. rode todo o stack atraves do setup-prod.sh para verificar os logs, e acesse meu servidor remoto com ssh root@217.79.189.223 senha root= @450Ab6606, teste os logs e retorno do frontend para visusalizar se ao iniciar o front envia HTML dos produtos da landing page, e corrija se houver erros, sendo que todo o meu folder que eh um git clone deste main, esta localizado no diretorio do servidor remoto, em /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL , analize tudo detalhadamente e faca todos os testes para remover issues e deixa o stack rodando localmente de ECOMMERCE.