# bematech-printer


## Sobre o projeto
### Por quê?
Tive a necessidade de integrar uma aplicação web com uma impressora térmica. Acabei escolhendo a bematech, por ser uma das líderes de mercado nesse setor. Na hora de desenvolver, senti que há uma carência na integração com a web, já que é algo mais avançado. Dessa forma foi criado esse pacote para você conseguir imprimir em sua bematech de um dispositivo na web.

### O que é necessário?
Por questões de segurança, você não conseguirá realizar a impressão diretamente de um browser. Para isso foi necessário criar uma aplicação nativa. Como eu tenho experiência em Node e conhecia o Electron( que é do github inclusive), acabei criando uma aplicação nativa utilizando essas 2 tecnologias. Com o Node.js fica mais fácil ainda, pois é utilizando um socket para realizar a comunicação entre o aplicativo nativo criado a partir do electron com a sua página web, de onde você irá chamar a impressão

### Como foi feito?
Imprimir em impressoras térmicas é uma tarefa mais complicada, pois basicamente é necessário escovar bits. Basicamente o que fiz foi mapear os comandos da documentação das impressoras da bematech e ler eles através de um arquivo XML. Para isso foi criado um compilador, que irá ler o que você deseja imprimir e transformar isso nos bits que a impressora da bematech entende.

***
## Como testar?
1. Instale o [Node.js](https://nodejs.org/en/)
2. Instale o [Electron](https://electron.atom.io/)
3. Instale o [Electron packager](https://github.com/electron-userland/electron-packager)

Abra seu terminal e digite `npm start`. Será aberto de forma automática o programa criado no electron, conforme imagem abaixo:

***

## Buid
Depois de testado e criado seus templates, você pode gerar o build do programa para distribuir para as plataformas windows, linux e OSX. Para isso basta digitar:

`electron-packager .`

Esse comando irá gerar o build para todas plataformas. Se desejar gerar apenas para plataformas específicas, consulte a documentação do [Electron packager](https://github.com/electron-userland/electron-packager)
