# Practica 4

## Ejercicio 4

Para la creación de este formulario hay que tener en cuenta dos inputs nuevos:

- ``input type="file"``: para archivos, vaya.
- ``input type="hidden"``: para crear algo oculto para el usuario, pero que aún así contenga un valor que yo mismo inserto.

El procedimiento luego es el mismo que hasta ahora, haciendo echo de todo mediante el post que realiza el formulario, con la única diferencia del tipo de alumno.

Al tener la posibilidad de ser alumno o profesor debido a la checkbox, hay que comprobar si es un array y en caso de que lo sea se utiliza la función implode para convertir los valores del arreglo en una cadena separada por comas.
Si no lo es, significa que solo hay un valor en "tipo".

Luego se lleva a cabo una verificación para confirmar que existe un archivo de fotos ``$_FILES["X"]["Y"];`` y finalmente se hace el echo del valor oculto como cualquier otro.
