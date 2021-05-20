create database lamoscaonline;
use lamoscaonline;

CREATE USER 'adminlamoscaonline'@'localhost' IDENTIFIED BY 'adminlamoscaonline';
GRANT ALL PRIVILEGES ON lamoscaonline . * TO 'adminlamoscaonline'@'localhost';
ALTER USER 'adminlamoscaonline'@'localhost' IDENTIFIED WITH mysql_native_password BY 'adminlamoscaonline';
FLUSH PRIVILEGES;

create table Players(
	username varchar(64) PRIMARY KEY,
    pasword varchar(200) not null, #pasword= password
	email varchar(320) unique not null, # 64 characters max before @ 255 characters max after @
    country varchar(90) not null,
    f_register datetime,
    rol varchar(50)
);
insert into Players(username,pasword,email,country,f_register,rol)
values('sergio','3bffa4ebdf4874e506c2b12405796aa5','sergioaliaga@gmail.com','spain',null,'user');
select * from Players;
select * from Skills;
desc Players;
delete  from players;
create table Skills(
	username varchar(64) PRIMARY KEY,
    wins int,
    losses int,
    percent decimal(3,0),
    xp int,
    foreign key (username) REFERENCES Players(username) on delete cascade
);

show tables;
