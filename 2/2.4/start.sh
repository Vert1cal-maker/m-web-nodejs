#!/bin/bash

# Запускаємо перший файл на порту 3010
node dist/main.js &

# Запускаємо другий файл на порту 3000
node dist/frontServ.js