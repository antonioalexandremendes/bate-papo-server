## Bate Papo Server

Instalar
```
npm install
```

Iniciar
```
npm run start

O sistema irá iniciar na url http://127.0.0.1:3001.
```

Executar Testes
```
npm run test
```

Acessar interface
```
http://127.0.0.1:3001/bate-papo
```

Rotas
```

GET : http://127.0.0.1:3001/sala
	|_ Listar todas as salas.

GET : http://127.0.0.1:3001/sala/[id_sala]/listar-usuarios
	|_ Listar todos os usuários de uma sala.

GET : http://127.0.0.1:3001/sala/[id_sala]/polling-listar-usuarios
	|_ Listar todos os usuários de uma sala utilizando long-polling.

POST : http://127.0.0.1:3001/sala/registar-usuario
	|_ Registrar usuário em uma sala, recebe nickname e id_sala, e retona o id_usuario.
	|_ Exemplo dados entrada:
	|	{
	|		"nickname": "Antonio",
	|		"sala": "tecnologia"
	|	}
	|
	|_ Exemplo retorno:
	|	6b592b35ce36669806994f32884cc6fe

GET : http://127.0.0.1:3001/sala/sair/[id_usuario]
	|_ Remover usuário de uma sala.

POST : http://127.0.0.1:3001/sala
	|_ Criar uma sala, recebe nome da sala, e retona o id_sala.
	|_ Exemplo dados entrada:
	|	{
	|		"sala": "Tecnologia BH"
	|	}
	|
	|_ Exemplo retorno:
	|	tecnologiabh

POST : http://127.0.0.1:3001/sala/[id_sala_origem]/trocar
	|_ Trocar usuário de sala, recebe id_sala_destino e id_usuario, e retona um boleano.
	|_ Exemplo dados entrada:
	|	{
	|		"sala_destino": "belohorizonte",
	|		"id_usuario": "1e5c215661e9b6b424f7e8b61212d375"
	|	}
	|
	|_ Exemplo retorno:
	|	true

POST : http://127.0.0.1:3001/mensagem
	|_ Enviar uma mensagem para uma sala, recebe id_sala, id_usuario e mensagem, opcionais nickname_destino e tipo (public / private), e retona um boleano.
	|_ Exemplo dados entrada:
	|	{
	|		"id_sala": "tecnologia",
	|		"id_usuario": "46d96206c40531e39725cea181b477fb",
	|		"mensagem": "Teste private para usuario",
	|		"nickname_destino": "Antonio 2",
	|		"tipo": "private"
	|	}
	|
	|_ Exemplo retorno:
	|	true

GET : http://127.0.0.1:3001/mensagem/listar-por-sala/[id_sala]/[id_usuario]
	|_ Listar todos as mensagens uma sala.

GET : http://127.0.0.1:3001/mensagem/polling/[id_sala]/[id_usuario]
	|_ Listar mensagens atualizadas de uma sala utilizando long-polling.
```
