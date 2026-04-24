A história desse projeto começou quando eu precisava de um programa que fizesse o trabalho do controle mestre (master) de uma emissora de TV. Não encontrei nenhum programa bom e gratuito. 

O melhor que achei foi o [Playdeck](https://playdeck.tv/). Da pra brincar bastante com ele porque tem todos os recursos liberados. Ele só coloca uma marca d'água no video.

Até que descobri o [casparCG](https://www.casparcg.com), que é open source. O servidor é bom, mas não tem nenhum cliente bom, e que atendia as necessidades de um master.

Percebi que ele é bem facil de interagir, então resolvir fazer meu próprio cliente.

Meus conhecimentos são limitados, mas sempre gosto de compartilhar o que sei para ajudar ou outros.

Prévia:
<img width="1714" height="966" alt="image" src="https://github.com/user-attachments/assets/aca02df3-e1bf-4c54-9e06-f74d1d3fa1ab" />

Para usá-lo, você precisa do [casparCG](https://www.casparcg.com) (2.5.0) e do [PHP](https://www.php.net) (8.5). Uma opção é usar o [PHP Desktop](https://github.com/cztomczak/phpdesktop)

Se você usar o servidor interno do PHP, você precisa criar 2 instâncias. Uma na porta de sua preferência (ex 80) e outra na porta 8080.
Isso é necessário porque o servidor interno é exclusivo pra desenvolvimento, e ele não aceita conexões simultâneas.

Acesse o site no seu navegador, endereço 127.0.0.1

Ao abrir o site pela primeira vez, coloque o IP do servidor nas configurações (engrenagem)

No arquivo de configuração do casparCG (**casparcg.config**), coloque no final, antes de </configuration> o seguinte:
```xml
    <osc>
        <default-port>6250</default-port>
        <predefined-clients>
            <predefined-client>
                <address>IP DO SERVIDOR WEB</address>
                <port>6250</port>
            </predefined-client>
        </predefined-clients>
    </osc>
```