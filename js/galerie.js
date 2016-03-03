/* PROPRIETES*/
var listColor= ["#09C2BF","#FFE3B0","#FF6C6B","#30FBBC","#1FD682"];
var wrapper=null;
var ratio=16/9;
var numCol=8;
var largeurColonne=0;
var margeH=0;
var margeV=0;
var nbrLigne=0;
var caseContainer = null;
var i=0;
var interval=null;
var currentCouvercle=null;
var couvercleToClose = null;
var timeOut=null;
var closeInterval = null;
var listeCases = [];
var level=1;
var vitesseJeu=500;
var voile='';
var centi=0;// initialise les dixtièmes
var secon=0; //initialise les secondes
var minu=0; //initialise les minutes
var compteur;
var tempsDeJeu=5;

/* METHODES*/
function initUI(){
	//recupération du body
	var body= document.getElementsByTagName('body');
	body[0].innerHTML = '<div id="wrapper"></div>';
	body[0].style.backgroundColor = listColor[0];

	//recuperation du wrapper
	wrapper = document.getElementById('wrapper');
	wrapper.style.backgroundColor=listColor[1];

	placeWrapper();
	
	//Mise en place des colonnes
	initColonne();

	//Calcul de la capacité de creer les lignes
	var hauteurDeLignes= nbrLigne*largeurColonne+(nbrLigne-1)*margeV;
	if(hauteurDeLignes>wrapper.offsetHeight-2*margeV){
		alert("impossible");
	}

	//suite au calculs application d'un padding au wrapper
	wrapper.innerHTML='<div id="caseContainer" style="font-size: 0"></div>';
	
	caseContainer = document.getElementById('caseContainer');

	placeContainer();

	var s='';
	//mise en place des cases
	for(i=0;i<(numCol-1)*nbrLigne;i++){
		s+='<div class="mycase" style="font-size: 0"></div>';
	}
	caseContainer.innerHTML=s;

	initCase();

	placeStartScreen();

}

function placeStartScreen(){
	voile = '<div id="voile"><div id="cartouche"><span id="titre">CHOP\' </span><span id="titre2">The Monster</span><div id="btn-start">JOUER</div></div></div>';
	document.getElementsByTagName('body')[0].innerHTML+=voile;
	var cartouche = document.getElementById('cartouche');
	cartouche.style.left = (window.innerWidth-cartouche.offsetWidth)*.5+"px";
	cartouche.style.top = (window.innerHeight-cartouche.offsetHeight)*.5+"px";

	var titre = document.getElementById('titre');
	titre.style.fontFamily='Lobster';
	titre.style.fontSize="72px";

	var titre2 = document.getElementById('titre2');
	titre2.style.fontFamily='Lobster';
	titre2.style.fontSize="24px";

	var btn=document.getElementById('btn-start');
	btn.style.fontFamily='Passion One';
	btn.style.fontSize = largeurColonne+"px";
	btn.style.cursor="pointer";
	btn.style.marginLeft=(cartouche.innertWidth-btn.offsetWidth)*.5+"px";
	btn.addEventListener('click',function(){
		playGame();
	});
}
function playGame(){
	//retirer le StartScreen
	document.getElementById('voile').remove();
	//lister les cases disponibles pour les monstres et les placer
	var listeCaseDispo = document.getElementsByClassName('mycase');
	var i;
	var tab=[];
	for(i=0;i<listeCaseDispo.length;i++){
		tab.push(listeCaseDispo[i]);
	}
	for(i =0;i<level;i++){
		var numeroCase = Math.floor(Math.random()*tab.length);
		var randomMonstre = Math.floor(Math.random()*5)+1;
		tab.slice(numeroCase,1);
		placeMonstre(numeroCase,randomMonstre);

	}
	//lancer et afficher le chronometre
	chronoStart();


	if(centi !== tempsDeJeu) {
		var chrono = '<div class="chrono"><div id="minutes">' + minu + '</div><div id="secondes">' + secon + '</div><div id="centième">' + centi + '</div></div>';
		document.getElementsByTagName('body')[0].innerHTML += chrono;
		console.log(centi);
	}else {
		console.log(centi +'est egale à '+tempsDeJeu);
		stopGame();
	}

}
function stopGame(){
	chronoStop();
	alert('fin de partie');
	initUI();
}
function chronoStart(){
	centi ++;
	console.log(secon);
	if (centi>9){centi=0;secon++}
	if (secon>59){secon=0;minu++}
	compteur=setTimeout('chronoStart()',100);

}
function chronoStop(){
	clearTimeout(compteur);
}

function initCouvercleAction(couvercle){
	couvercle.addEventListener('click', function(){
		if(interval !=null) return;
		if(couvercleToClose !=null){
			if (timeOut !=null){
				clearTimeout(timeOut);
				timeOut=null;
				closeCouvercle();
			}
		}
		currentCouvercle=this;
		interval=setInterval(function(){
			if (currentCouvercle.offsetLeft>-currentCouvercle.offsetWidth){
				currentCouvercle.style.left=currentCouvercle.offsetLeft-10+"px";
			}else{
				clearInterval(interval);
				interval=null;
				couvercleToClose = currentCouvercle;
				currentCouvercle = null;
				timeOut=setTimeout(function(){
					timeOut=null;
					if(couvercleToClose !=null)closeCouvercle();
				},vitesseJeu);
			}

		},vitesseJeu/10);
	});
}

function placeMonstre(numeroCase,randomMonstre){
	var fuckoff ='<div id="monster'+randomMonstre+'" class="monster"></div>';
	var caseCouvercle= listeCases[0].innerHTML;
	listeCases[numeroCase].innerHTML=fuckoff+caseCouvercle;
	var couvercle = listeCases[numeroCase].getElementsByClassName('couvercle')[0];
	initCouvercleAction(couvercle);
}
function initCase(){
	listeCases=document.getElementsByClassName('mycase');
	var l=listeCases.length;

	for(i=0;i<l;i++){
		listeCases[i].style.backgroundColor = listColor[2];
		listeCases[i].style.width= largeurColonne+"px";
		listeCases[i].style.height= largeurColonne+"px";
		listeCases[i].style.display="inline-block";
		listeCases[i].style.position="relative";
		listeCases[i].style.overflow="hidden";

		//utilisation du modulo pour afffectation marge droite
		//pour toute case sauf bout de ligne

		if((i+1)%(numCol-1)!=0){
			listeCases[i].style.marginRight=margeH+"px";
		}
		if(i<l-(numCol-1)){
			listeCases[i].style.marginBottom=margeV+"px";
		}
		//mise en place couvercle
		listeCases[i].innerHTML='<div class="couvercle"></div>';
		//formater les couvercles
		var couvercle = listeCases[i].getElementsByClassName('couvercle')[0];
		couvercle.style.backgroundColor=listColor[3];
		couvercle.style.width="100%";
		couvercle.style.height="100%";
		couvercle.style.position="absolute";
		couvercle.style.cursor="pointer";
		initCouvercleAction(couvercle);
	}
return true;
}

function placeContainer(){
	caseContainer.style.width= wrapper.offsetWidth-2*margeH+"px";
	caseContainer.style.height=wrapper.offsetHeight-2*margeV+"px";
	caseContainer.style.position="absolute";
	caseContainer.style.padding= margeV +"px "+ margeH +"px";
}

function initColonne(){
	largeurColonne=Math.floor(wrapper.offsetWidth/numCol);
	margeH=Math.floor(largeurColonne/numCol);
	nbrLigne=Math.floor(wrapper.offsetHeight/largeurColonne);
	margeV=Math.floor((wrapper.offsetHeight-(nbrLigne*largeurColonne))/(nbrLigne+1));
}

function placeWrapper(){
	//dimensionnement du wrapper par rapport à l'espace dispo dans la fenetre

	var w = Math.ceil(window.innerWidth *.8);
	var h = Math.ceil(w/ratio);

	if(h>window.innerHeight){
		h= Math.ceil(window.innerHeight *.8);
		w= Math.ceil(h*ratio);
	}

	wrapper.style.width=w+"px";
	wrapper.style.height=h+"px";
	wrapper.style.left = (window.innerWidth-wrapper.offsetWidth)*.5+"px";
	wrapper.style.top = (window.innerHeight-wrapper.offsetHeight)*.5+"px";
	wrapper.style.position="absolute";
}

function closeCouvercle(){
	closeInterval=setInterval(function(){
		if(couvercleToClose.offsetLeft<0){
			couvercleToClose.style.left = couvercleToClose.offsetLeft+10+'px';
		}else{
			couvercleToClose.style.left="0px";
			clearInterval(closeInterval);
			couvercleToClose=null;
		}
	},vitesseJeu/10 *.8);
}

window.onresize=function(){
	placeWrapper();
	initColonne();
	placeContainer();
	initCase();

};