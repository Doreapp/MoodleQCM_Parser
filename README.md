# Moodle QCM : Parser
Parser of QCM questions 

Permet de *parser* rapidement et fidellement les questions d'un QCM moodle 

Permet également de **créer un texte au format csv** 

## Comment utiliser 

1. Copiez le contenu du fichier `moodle_parser.js`
2. Dans la page du QCM (lancé : status *en cours*), ouvrez les `outils développeurs` -> onglet `Console` 
3. Collez le script (cf 1.) dans la `Console` (barre de commande) et `Entrer` pour lancer le script. 

Le script va alors s'exécuter, certains nombres vont s'afficher (vous garantissant que l'execussion se passe bien) 

A la fin, **le texte au format CSV générer sera affiché dans la console**.

### Comment passer de ce texte à un fichier excel ?

1. Copiez collez le texte dans un bloc note.

2. Enregistrez le fichier sous la forme [nomFichier].txt

3. Ouvrez Excel. 

4. Dans Excel faites `Ouvrir` > `Parcourir` et trouvez votre fichier .txt

5. Ensuite, dans la fenêtre *Assistant importation de texte* :
* Cochez `Délimité`
* `Suivant`
* Cocher **uniquement** `Point virgule` et non Tabulation
* `Terminer` 

Et **voila** !
