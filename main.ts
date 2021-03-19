/**
 * Fonctions qui gèrent les moteurs. Voir le programme Test des moteurs pour déterminer le sens de rotation selon le moteur.
 */
// Adaptation pour Micro:Bit du Projet Panneau solaire dirigeable développé par le RÉCIT MST
// 
// https://laboratoirecreatif.recit.org/projet-panneau-solaire-auto-dirigeable/
function Gauche () {
    servos.P1.setAngle(PosHoriz)
}
// Détermination des constantes qui gère la tolérance de réaction ainsi que le délai des lectures.  Peuvent être modifiées au besoin.
function Arret () {
    servos.P0.stop()
    servos.P1.stop()
}
function Haut () {
    servos.P0.setAngle(PosVert)
}
function PositionInitiale () {
    servos.P0.setAngle(limitebas)
    servos.P1.setAngle(limiteGauche)
}
function Droite () {
    servos.P1.setAngle(PosHoriz)
}
function Bas () {
    servos.P0.setAngle(PosVert)
}
let DiffHorizontale = 0
let MoyenneDroite = 0
let MoyenneGauche = 0
let photoBG = 0
let photoBD = 0
let photoHG = 0
let photoHD = 0
let MoyenneBas = 0
let MoyenneHaut = 0
let DiffVerticale = 0
let PosVert = 0
let PosHoriz = 0
let limiteGauche = 0
let limitebas = 0
radio.setGroup(1)
let tolerance = 40
let delaislecture = 10
limitebas = 90
let limitehaut = 180
limiteGauche = 0
let LimiteDroit = 180
servos.P0.setRange(limiteGauche, LimiteDroit)
servos.P1.setRange(limitebas, limitehaut)
basic.forever(function () {
    serial.redirectToUSB()
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P9) == 0) {
        Arret()
        basic.pause(500)
        Haut()
        basic.pause(1000)
        Gauche()
        basic.pause(2000)
        Arret()
        basic.pause(1000)
    }
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P11) == 0) {
        Arret()
        basic.pause(500)
        Bas()
        basic.pause(1000)
        Gauche()
        basic.pause(2000)
        Arret()
        basic.pause(1000)
    }
})
basic.forever(function () {
    if (-1 * tolerance > DiffVerticale || DiffVerticale > tolerance) {
        if (MoyenneHaut > MoyenneBas) {
            Haut()
        } else if (MoyenneHaut < MoyenneBas) {
            Bas()
        } else if (MoyenneHaut == MoyenneBas) {
            Arret()
        }
    }
})
// Lecture des photorésistances et affichage des données si branché USB.
basic.forever(function () {
    photoHD = pins.analogReadPin(AnalogPin.P2)
    photoHG = pins.analogReadPin(AnalogPin.P3)
    photoBD = pins.analogReadPin(AnalogPin.P4)
    photoBG = pins.analogReadPin(AnalogPin.P10)
    MoyenneBas = (photoBD + photoBG) / 2
    MoyenneHaut = (photoHD + photoHG) / 2
    MoyenneGauche = (photoBG + photoHG) / 2
    MoyenneDroite = (photoBD + photoHD) / 2
    DiffVerticale = MoyenneHaut - MoyenneBas
    DiffHorizontale = MoyenneGauche - MoyenneDroite
    radio.sendValue("Photo BD", photoBD)
    radio.sendValue("Photo BG", photoBG)
    radio.sendValue("Photo HD", photoHD)
    radio.sendValue("Photo HG", photoHG)
    serial.writeNumbers([MoyenneHaut, MoyenneBas, MoyenneGauche, MoyenneDroite, delaislecture, tolerance])
    serial.writeLine("")
})
// Gère la rotation de la case
basic.forever(function () {
    let DelaiPause = 0
    if (-1 * tolerance > DiffHorizontale || DiffHorizontale > tolerance) {
        if (MoyenneGauche > MoyenneDroite) {
            Gauche()
        } else if (MoyenneGauche < MoyenneDroite) {
            Droite()
        } else if (MoyenneGauche == MoyenneDroite) {
            Arret()
        }
    }
    basic.pause(DelaiPause)
    Arret()
    basic.pause(DelaiPause)
})
