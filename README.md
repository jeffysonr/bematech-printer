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

Abra seu terminal e digite `npm start`. Será aberto de forma automática o programa criado no electron.

Para testar, abra o arquivo demo.html. Foi criado uma pagina web utilizando angular 1 para demonstrar como utilizar.

Basicamente para imprimir é necessário:
1. Conectar com o socket (e com o programa electron)
2. Enviar um socket com os dados da impressão (template, n'úmero de copias e dados extras)
3. O template basta você criar um arquivo XML na pasta /bematech/layouts/seuarquivo.xml. Na hora de imprimir, basta indicar o nome do template, sem a extensão XML.

***
## Comandos XML

#### Root
Seu arquivo XML deve sempre iniciar com o elemento <root></root>. O root serve como um <html></html>, e indica o inicio de uma pagina. Nele há os seguintes atributos:

- <root cut="full"> -> Apos a impressão, sera feito o corte total do papel.
- <root cut="half"> -> Apos a impressão, ser'á feito o corte parcial do papel.
-
#### Line
O elemento <line></line> indica uma linha da pagina. Basicamente você trabalhará bastante com esse elemento, e é nele que você fará toda formatação de texto.

Para facilitar, utilizamos os atributos baseados nas propriedades CSS: Align, textTransform e fontSize.

Abaixo há a lista dos atributos e valores possíveis, lembrando que você pode repetir atributos para setar mais de um estilo (por exemplo, paa setar um texto negrito e itálico ao mesmo tempo).

- <line align="left">Texto alinhado à esquerda</line>
- <line align="left">Texto alinhado ao centro</line>
- <line align="left">Texto alinhado à direita</line>
- <line textTransform="bold">Texto em negrito</line>
- <line textTransform="italic">Texto em itálico</line>
- <line textTransform="underline">Texto com sublinhado</line>
- <line fontSize="expanded">Texto com fonte expandida</line>
- <line fontSize="large">Texto com fonte larga</line>

#### Quebra de linha
Basta utilizar um elemento <line /> vazio:

- <line></line>

#### Observações gerais:
Sempre que definido uma propriedade, a formatação é aplicada somente a linha atual.

***

## Buid
Depois de testado e criado seus templates, você pode gerar o build do programa para distribuir para as plataformas windows, linux e OSX. Para isso basta digitar:

`electron-packager .`

Esse comando irá gerar o build para todas plataformas. Se desejar gerar apenas para plataformas específicas, consulte a documentação do [Electron packager](https://github.com/electron-userland/electron-packager)
