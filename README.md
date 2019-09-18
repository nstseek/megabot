# megabot
nodejs application to automatize the download process

- se for a primeira vez que você está rodando o programa, execute no terminal "sh firstrun.sh", senão, execute apenas "sh run.sh"

- toda execução do programa gera um log.txt com todo o output do programa para verificação posterior

- as htmls que serão baixadas devgem ser colocadas em futureHTMLs, podendo ser deletadas/alteradas após o inicio do programa

- se estiver na pucrs, o script so ira funcionar no meu usuario, com meu DriveH, para isso, rode "run firstrunpucrs.sh" e nas rodadas subsequentes "sh runpucrs.sh"

- o programa pode ser usado na forma --watch, onde ele ira observar por mudanças na pasta futureHTMLs/ e baixará automaticamente arquivos adicionados nessa pasta

- o programa também suporta a opção --git, onde ele irá sincronizar a pasta futureHTMLs/ com sua repo, atualizando a pasta com htmls enviadas remotamente e baixando automaticamente, o servidor atualiza o git a cada minuto

- para usar as opcoes --watch e --git, você pode rodar node js/server.js --downloadvideos --watch --git ou somente node js/server.js --watch --git

- use o mvFileWatcher.js para que os htmls salvos em uma pasta sejam automaticamente renomeados, ele ira criar uma pasta chamada watchDir, coloque seus arquivos dentro desta pasta

- o programa deve funcionar normalmente com htmls ate o numero 100, nao foi testado alem disso
