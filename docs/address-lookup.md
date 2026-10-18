# Endereço e consulta de CEP

O checkout consulta `https://brasilapi.com.br/api/cep/v1/{cep}` ao completar oito dígitos, conforme escolha do projeto. É uma chamada pública no navegador, sem credenciais; não é a API autenticada dos Correios. Documentação: https://brasilapi.com.br/docs#tag/CEP.

Rua, bairro, cidade e UF são preenchidos e continuam editáveis. Número e complemento são informados pelo cliente. Falhas, CEP não encontrado e timeout permitem preenchimento manual e nova tentativa. Uma troca de CEP cancela a consulta anterior. Nenhum endereço é enviado a um backend; somente o CEP é enviado à BrasilAPI.

O contrato `Order.address` continua sendo uma string formatada, mantendo a compatibilidade entre os micros. O total confirmado é preservado antes de limpar o carrinho.

Os testes Playwright interceptam a BrasilAPI para cobrir sucesso e CEP não encontrado sem depender de um serviço externo. Também verificam catálogo, carrinho e checkout em viewport mobile com produtos carregados.
