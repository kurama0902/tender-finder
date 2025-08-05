# Tender Finder App


## Installation

Use the npm to install all the dependecy for ui

```bash
cd ui
npm install
```

Create a virtual environment
```bash
cd API
python -m venv venv
```

Activate venv
```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

Download python requirements
```bash
pip install -r requirements.txt
```

## MySQL

### Download the MySQL 9.4.0 by this link
https://dev.mysql.com/downloads/mysql/?platform&os=3 (root password in my case is '1234')

```cmd
# windows set path MySQL (cmd)
set PATH=%PATH%;"C:\Program Files\MySQL\MySQL Server 9.4\bin"

```

### Dowload the MySQL Workbench 8.0.43 by this link
 https://dev.mysql.com/downloads/workbench/

### When you installed MySQL and Workbench:
```bash
mysql -u root -p
[Enter your password]
```

```bash
# creating a new database named 'tender_db'
CREATE DATABASE tender_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
```

```bash
# tender_db selection
USE tender_db; 
```

```bash
# creating a new table named 'tender_data'

CREATE TABLE tender_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    province VARCHAR(255),
    location VARCHAR(255),
    municipality VARCHAR(255),
    
    tender_longitude DECIMAL(18, 15),
    tender_latitude DECIMAL(18, 15),
    center_municipality_longitude DECIMAL(18, 15),
    center_municipality_latitude DECIMAL(18, 15),
    
    tender_deadline DATE,
    publication_date DATE,
    status VARCHAR(255),
    details TEXT,
    
    expensive_ratio DECIMAL(10, 5),
    midrange_ratio DECIMAL(10, 5),
    social_ratio DECIMAL(10, 5),
    
    winner VARCHAR(255),
    number_of_properties INT
);
```

# Open the MySQL Workbench and follow the screenshots. We will import the tableData.csv(available on gitHub) to the database

## Find "MySQL Connnections"
![App Screenshot](https://ik.imagekit.io/joslpuulp/1.jpg?updatedAt=1754419952096)

## Click "+" to add a new connnection
![App Screenshot](https://ik.imagekit.io/joslpuulp/2.jpg?updatedAt=1754419952068)

## Setup your connection, set any name to the connection, root, click "Store in Vault" to enter the password from root
![App Screenshot](https://ik.imagekit.io/joslpuulp/3.jpg?updatedAt=1754419951937)

## Enter the root password
![App Screenshot](https://ik.imagekit.io/joslpuulp/4.jpg?updatedAt=1754419952102)

## Select the "Schemas" on the bottom
![App Screenshot](https://ik.imagekit.io/joslpuulp/5.jpg?updatedAt=1754419952086)

## Right click on tender_data
![App Screenshot](https://ik.imagekit.io/joslpuulp/6.jpg?updatedAt=1754419952014)

## Choose the tableData.csv file from the gitHub repo
![App Screenshot](https://ik.imagekit.io/joslpuulp/7.jpg?updatedAt=1754419952072)

## Find the tool icon near to the "Detected file format" text
![App Screenshot](https://ik.imagekit.io/joslpuulp/8.jpg?updatedAt=1754419952119)

## Click on the tool icon
![App Screenshot](https://ik.imagekit.io/joslpuulp/9.jpg?updatedAt=1754419951982)

## Select all the settings like on the screenshot
![App Screenshot](https://ik.imagekit.io/joslpuulp/10.jpg?updatedAt=1754419951992)


## Next and done
![App Screenshot](https://ik.imagekit.io/joslpuulp/11.jpg?updatedAt=1754419954836)


# Go to the config.py and setup the values from the screenshot
![App Screenshot](https://ik.imagekit.io/joslpuulp/12.jpg?updatedAt=1754423181377)

# How to start?

```bash
# ui folder
npm run dev

# API folder

python run.py
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
