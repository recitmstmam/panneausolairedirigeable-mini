/**
 * Fonctions qui gèrent les moteurs. Voir le programme Test des moteurs pour déterminer le sens de rotation selon le moteur.
 */
/**
 * Gère la rotation de la case
 */
/**
 * Adaptation pour Micro:Bit du Projet Panneau solaire dirigeable développé par le RÉCIT MST
 * 
 * https://laboratoirecreatif.recit.org/projet-panneau-solaire-auto-dirigeable/
 */
function Gauche () {
    motorbit.freestyle(0, -50)
}
/**
 * Détermination des constantes qui gère la tolérance de réaction ainsi que le délai des lectures.  Peuvent être modifiées au besoin.
 */
function Arret () {
    motorbit.brake()
}
function Haut () {
    motorbit.freestyle(-50, 0)
}
function Droite () {
    motorbit.freestyle(0, 50)
}
function Bas () {
    motorbit.freestyle(50, 0)
}
let DiffHorizontale = 0
let DiffVerticale = 0
let MoyenneDroite = 0
let MoyenneGauche = 0
let MoyenneHaut = 0
let MoyenneBas = 0
let photoBD = 0
let photoHG = 0
let photoHD = 0
radio.setGroup(1)
let tolerance = 40
let delaislecture = 10
let limitebas = 90
let limitehaut = 100
let limiteGauche = 0
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
/**
 * Lecture des photorésistances et affichage des données si branché USB.
 */
basic.forever(function () {
    photoHD = pins.analogReadPin(AnalogPin.P3)
    photoHG = pins.analogReadPin(AnalogPin.P4)
    photoBD = pins.analogReadPin(AnalogPin.P10)
    MoyenneBas = photoBD
    MoyenneHaut = (photoHD + photoHG) / 2
    MoyenneGauche = (photoBD + photoHG) / 2
    MoyenneDroite = (photoBD + photoHD) / 2
    DiffVerticale = MoyenneHaut - MoyenneBas
    DiffHorizontale = MoyenneGauche - MoyenneDroite
    radio.sendValue("Photo bas", photoBD)
    radio.sendValue("Photo HD", photoHD)
    radio.sendValue("Photo DG", photoHG)
    serial.writeNumbers([MoyenneHaut, MoyenneBas, MoyenneGauche, MoyenneDroite, delaislecture, tolerance])
    serial.writeLine("")
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
