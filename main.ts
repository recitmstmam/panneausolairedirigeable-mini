/**
 * Fonctions qui gèrent les moteurs. Voir le programme Test des moteurs pour déterminer le sens de rotation selon le moteur.
 */
// Adaptation pour Micro:Bit du Projet Panneau solaire dirigeable développé par le RÉCIT MST
// 
// https://laboratoirecreatif.recit.org/projet-panneau-solaire-auto-dirigeable/
function Gauche () {
    PositionHoriz += PasDeDeplacement
    if (PositionHoriz >= LimiteDroite) {
        PositionHoriz = LimiteDroite
    } else {
        servos.P1.setAngle(PositionHoriz)
    }
}
// Détermination des constantes qui gère la tolérance de réaction ainsi que le délai des lectures.  Peuvent être modifiées au besoin.
function Arret () {
    servos.P0.stop()
    servos.P1.stop()
}
function Haut () {
    PositionVerticale += PasDeDeplacement
    if (PositionVerticale >= LimiteHaut) {
        PositionVerticale = LimiteHaut
    } else {
        servos.P0.setAngle(PositionVerticale)
    }
}
function PositionInitiale () {
    servos.P0.setAngle(LimiteBas)
    servos.P1.setAngle(limiteGauche)
}
function Droite () {
    PositionHoriz += -1 * PasDeDeplacement
    if (PositionHoriz <= limiteGauche) {
        PositionHoriz = limiteGauche
    } else {
        servos.P1.setAngle(PositionHoriz)
    }
}
function Bas () {
    PositionVerticale += -1 * PasDeDeplacement
    if (PositionVerticale <= LimiteBas) {
        PositionVerticale = LimiteBas
    } else {
        servos.P0.setAngle(PositionVerticale)
    }
}
let DiffHorizontale = 0
let DiffVerticale = 0
let MoyenneDroite = 0
let MoyenneGauche = 0
let MoyenneHaut = 0
let MoyenneBas = 0
let PhotoBG = 0
let PhotoBD = 0
let PhotoHG = 0
let PhotoHD = 0
let PositionVerticale = 0
let PasDeDeplacement = 0
let PositionHoriz = 0
let LimiteDroite = 0
let limiteGauche = 0
let LimiteHaut = 0
let LimiteBas = 0
radio.setGroup(1)
let Tolerance = 40
let DelaiLecture = 10
let DelaiPause = 1000
LimiteBas = 90
LimiteHaut = 180
limiteGauche = 0
LimiteDroite = 180
servos.P0.setRange(limiteGauche, LimiteDroite)
servos.P1.setRange(LimiteBas, LimiteHaut)
basic.forever(function () {
    serial.redirectToUSB()
})
// Lecture des photorésistances et affichage des données si branché USB.
basic.forever(function () {
    PhotoHD = pins.analogReadPin(AnalogPin.P2)
    PhotoHG = pins.analogReadPin(AnalogPin.P3)
    PhotoBD = pins.analogReadPin(AnalogPin.P4)
    PhotoBG = pins.analogReadPin(AnalogPin.P10)
    MoyenneBas = (PhotoBD + PhotoBG) / 2
    MoyenneHaut = (PhotoHD + PhotoHG) / 2
    MoyenneGauche = (PhotoBG + PhotoHG) / 2
    MoyenneDroite = (PhotoBD + PhotoHD) / 2
    DiffVerticale = MoyenneHaut - MoyenneBas
    DiffHorizontale = MoyenneGauche - MoyenneDroite
    radio.sendValue("Photo BD", PhotoBD)
    radio.sendValue("Photo BG", PhotoBG)
    radio.sendValue("Photo HD", PhotoHD)
    radio.sendValue("Photo HG", PhotoHG)
    serial.writeNumbers([MoyenneHaut, MoyenneBas, MoyenneGauche, MoyenneDroite, DelaiLecture, Tolerance])
    serial.writeLine("")
})
// Gère la rotation de la case
basic.forever(function () {
    if (-1 * Tolerance > DiffHorizontale || DiffHorizontale > Tolerance) {
        if (MoyenneGauche > MoyenneDroite) {
            if (PositionHoriz >= limiteGauche && PositionHoriz <= LimiteDroite) {
                Gauche()
            }
        } else if (MoyenneGauche < MoyenneDroite) {
            if (PositionHoriz >= limiteGauche && PositionHoriz <= LimiteDroite) {
                Droite()
            }
        } else if (MoyenneGauche == MoyenneDroite) {
            Arret()
        }
    }
    if (-1 * Tolerance > DiffVerticale || DiffVerticale > Tolerance) {
        if (MoyenneHaut > MoyenneBas) {
            if (PositionVerticale >= LimiteBas && PositionVerticale <= LimiteHaut) {
                Haut()
            }
        } else if (MoyenneHaut < MoyenneBas) {
            if (PositionVerticale >= LimiteBas && PositionVerticale <= LimiteHaut) {
                Bas()
            }
        } else if (MoyenneHaut == MoyenneBas) {
            Arret()
        }
    }
    basic.pause(DelaiPause)
})
