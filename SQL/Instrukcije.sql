
create table grupa(
	sifra int not null primary key identity(1,1),
	naziv varchar(50) not null,
	datumpocetka varchar(50) not null,
	
);

create table predmet(
	sifra int not null primary key identity(1,1),
	grupa int not null,
	naziv varchar(50) not null,
	cijena decimal(18,2) null,
	trajanje int null,
);


create table polaznik(
	sifra int not null primary key identity(1,1),
	ime varchar(50) not null,
	prezime varchar(50) not null,
	oib char(11),
	email varchar(100)
);

create table clan(
	predmet int not null,
	polaznik int not null
);
alter table predmet add foreign key (grupa) references grupa(sifra);
alter table clan add foreign key (predmet) references predmet(sifra);
alter table clan add foreign key (polaznik) references polaznik(sifra);


insert into grupa (naziv,datumpocetka)
values ('M1','2023-04-26 19:00:00');



insert into grupa (naziv,datumpocetka)
values ('C3','2023-12-30 17:00:00');

insert into predmet (grupa,naziv,cijena,trajanje)
values (1,'Matematika',null,150);


insert into polaznik(ime,prezime,oib,email)
values 
('Luka','Bu�i�',null,'busic.luka1@gmail.com'),
('Domagoj','Markovi�',null,'markovicdomagoj1995@gmail.com'),
('Andrija','Kruhoberec',null,'akruhoberec1@outlook.com'),
('Vedran','D�anko',null,'vedran.dzanko@gmail.com'),
('Antonio','Maji�', null, 'antonio.majich@gmail.com'),
('Lana','Jeleni�',null,'lana.jelenic@gmail.com'),
('Jasenka','Augustinovi�',null,'jaugustinovic85@gmail.com'),
('Domagoj','Ljubi�i�',null,'dljubicic2@gmail.com'),
('Leo','Lovenjak',null,'leo.lovenjak107@gmail.com'),
('Leon','Bi�ak',null,'lbicak96@gmail.com'),
('Katarina','Pavli�evi�',null,'katarina.pavlicevic5@gmail.com'),
('Darko','Ku�an',null,'dkucan61@gmail.com'),
('Patrik','Gomer�i�',null,'patrik.gomercic3@gmail.com'),
('Antonio','�ubari�',null,'antonio.subaric98@gmail.com'),
('Sr�an','Filipovi�',null,'srdjanfilipovic991@gmail.com'),
('Jakob','Brki�',null,'jakobbrkic97@gmail.com'),
('Alen','Oroz',null,'alen.oroz1@gmail.com'),
('Ivor','�eli�',null,'ivorcelic@gmail.com'),
('Anja','Andonovski',null,'andonovski.anja@gmail.com'),
('Bruno','Bu�i�',null,'brunobusic20@gmail.com'),
('Karlo','Peri�',null,'karlocar25@gmail.com'),
('Kristijan','Beri�a',null,'k_berisa@hotmail.com'),
('Valentin','Mijatovi�',null,'mijatovic.valentin123@gmail.com'),
('Ivan','Angebrandt',null,'ivan.angebrandt@gmail.com'),
('Luka','Mr�a',null,'luka.mrda@yahoo.com');



insert into clan(predmet,polaznik)
values (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),
(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),
(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),
(1,21),(1,22),(1,23),(1,24),(1,25);


select * from grupa;

ALTER TABLE grupa
ALTER COLUMN datumpocetka datetime;