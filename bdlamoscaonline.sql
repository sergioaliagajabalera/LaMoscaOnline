create database lamoscaonline;
use lamoscaonline;

CREATE USER 'adminlamoscaonline'@'localhost' IDENTIFIED BY 'adminlamoscaonline';
GRANT ALL PRIVILEGES ON lamoscaonline . * TO 'adminlamoscaonline'@'localhost';
FLUSH PRIVILEGES;

create table Players(
	username varchar(64) PRIMARY KEY,
    pasword varchar(200) not null, #pasword= password
	email varchar(320) unique not null, # 64 characters max before @ 255 characters max after @
    country varchar(90) not null,
    f_register datetime,
    rol varchar(50)
);
select * from Players;
desc Players;

create table Skills(
	username varchar(64) PRIMARY KEY,
    best_streake int,
    current_streake int,
    wins int,
    losses int,
    percent decimal(3,0),
    best_time time,
    xp int
);
show tables;
