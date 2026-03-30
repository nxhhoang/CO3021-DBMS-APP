# How to run
- Download `PostgresSQL` extension from Microsort in vscode
- Use `docker compose up -d` to start database
- Use `operate.sh` to manipulate with data using query (`db.categories.find()`, `SELECT * FROM USERS`,...)
- Delete docker image by `docker compose -v down` after using (if u want)
- Remember to run `sync_inventory.js` in backend to update inventory data for PostgresSQL