// INSERT INTO Customers (CustomerName, City, Country) VALUES ('Cardinal', 'Stavanger', 'Norway');
const table='',cols:string[]=[],vals:string[]=[]
const insertTemplate = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${vals.join(',')});`

