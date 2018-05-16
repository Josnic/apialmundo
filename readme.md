# Almundo REST API
Tiene estructura de modulado, donde cada parte del API esta separada para luego integrarse de manera escalonada y total. Se usó NodeJS versión 6.11.1 con NPM 3.10.10. Inicialmente, el endpoint `/readFront` funciona como un Backend normal, es decir, no pide autenticación y permite a la aplicación de Frontend obtener los datos de los hoteles; los demas endpoints funcionan según estandar REST: atenticación para acceder (basado en Web Token), códigos de estado: 200, 201, 404, y respuesta en formato JSON.
El Api persiste a datos por medio de Mongoose, módulo NodeJS para Base de Datos no relacional MongoDB; para enrutamiento se usa Express y junto con otros módulos como body-parser, cors, express-json-validator-middleware se manipula el cuerpo de las peticiones; para la autenticación se usa jsonwebtoken.

## Despliegue
Al usar `NPM`, se tiene un archivo `package.json` con todas las dependencias de la aplicación, por lo que el despliegue via Git es extremadamente sencillo. 

## Estrutura
La aplicación contiene los siguientes modulos:
* `config`: Contiene un archivo de configuración con datos globales del API: Url de conexión a la Base de Datos y una palabra clave para la generación y validación del Token de autorización de los usuarios clientes.
* `models`: En realidad, en este directorio solo existe un archivo `JS` que define el modelo de datos de los hoteles para que el módulo Mongoose interactue con la Base de Datos.
* `controllers`: Contiene 2 archivos: uno que contiene el CRUD de operaciones sobre la Base de Datos de Mongo y el otro contiene un controlador de respuesta (`response`) al consumir un endpoint.
* `routes`: Contiene un archivo que define las rutas o endpoints para el consumo del cliente: autenticación y CRUD.
* `server.js`: Es el archivo `main` de la aplicación que integra todo lo mencionado anteriormente.
* `insertUser.js`: Es un archivo adicional que permite crear usuarios en la colección `users`de la Base de Datos. 
* `insertData`: Este archivo contiene la funcionalidad de la importación de los datos de los hoteles a la coleccion `hotel`.

## EndPoints

* `/readFront?stars=3&name=demo`: Este endpoint NO está dentro de la autenticación, sino es solo para consumo de la WebApp. Arroja los datos de los hoteles de acuerdo a 2 filtros:estrellas y nombre del hotel. Método `GET`.
* `apiv1/authenticate`: Permite autenticarse con el usuario y contraseña y obtener un Token para enviarlo en las peticiones posteriores para consumir los endpoints protegidos. Se envia un cuerpo formato JSON con `{name:user,password:pass}`. Método `POST`.
A continuación se enumeran los Endpoints protegidos:
* `/apiv1/readAll`: Este endpoint trae todos los datos de los hoteles sin filtrar.
* `/apiv1/readOne/:id/`: Permite traer la información de un hotel según su ID.Método `GET`.
* `/apiv1/create`: permite crear un nuevo hotel. Se envia en la petición un cuerpo con toda la información del mismo. Método `POST`.
* `/apiv1/update`: Actualiza la información de un hotel de acuerdo a su ID. El payload a enviar es el mismo de `/apiv1/create`. Método `PUT`.
* `apiv1/delele`:Elimina un hotel enviando en el body de la petición: `{id:1}`. Método `DELETE`.
Para los Endpoints protegidos se debe de enviar un header con el nombre `x-access-token`.


Para ver en funcionamiento puede ir [aquí](https://frontalmundo.herokuapp.com/), que es la aplicación Fronted que consume el API cuyo endpoint no requiere autenticación.
De igual forma, puede consultar el home del API [https://apialmundo.herokuapp.com/](https://apialmundo.herokuapp.com/)