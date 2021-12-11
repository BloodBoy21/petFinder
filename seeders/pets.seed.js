'use strict'
/* eslint-disable */
const db = require('../db')
const { Pet, AvailablePet } = require('../models/index')
const maleNames = `
MAX	KOBE	OSCAR
COOPER	OAKLEY	MAC
CHARLIE	REX	RUDY
TEDDY	BAILEY	CHIP
BEAR	CASH	WALTER
MILO	JASPER	BLAZE
BENTLEY	BO	OZZY
OLLIE	BOOMER	ODIN
BUDDY	LUCKY	AXEL
ROCKY	RUGER	BRUCE
LEO	BEAU	ODIE
ZEUS	BAXTER	ARLO
DUKE	OREO	ECHO
FINN	GUNNER	TANK
APOLLO	HENRY	ROMEO
MURPHY	SIMBA	PORTER
DIESEL	GEORGE	HARLEY
TOBY	COCO	OTIS
LOUIE	ROCKET	ROCCO
TUCKER	ZIGGY	REMI
JAX	PRINCE	WHISKEY
ACE	SHADOW	SAM
JACK	RILEY	BUSTER
KODA	COPPER	BUBBA
WINSTON	LUKE	JAKE
OLIVER	MARLEY	BENNY
GUS	ZEKE	BOWIE
LOKI	LEVI	DOZER
MOOSE	BENJI	RUSTY
ARCHIE	RANGER	JOEY
BANDIT	REMY	KYLO
SCOUT	DEXTER	RYDER
THOR	GIZMO	TYSON
BRUNO	CHASE	SAMSON
KING	CODY	RAMBO
BLUE	SARGE	HARRY
ATLAS	CHESTER	GUCCI
THEO	MAVERICK	MILES
JACKSON	LINCOLN	WATSON
HANK	WALLY	PEANUT
TITAN`.split(/\s+/)
const femaleNames = `LUNA	RIVER	DOLLY
BELLA	LAYLA	CLEO
DAISY	WINNIE	MAPLE
LUCY	SKYE	VIOLET
BAILEY	COOKIE	ANGEL
NALA	SCOUT	OLIVE
ELLIE	LULU	LADY
SADIE	STAR	JUNO
RUBY	CHARLIE	FIONA
MAGGIE	ZOE	ARYA
ROSIE	KONA	GIGI
STELLA	ABBY	JADE
WILLOW	BONNIE	IVY
LOLA	SASSY	BLUE
COCO	EMMA	PHOEBE
PIPER	MAYA	ECHO
SOPHIE	TRIXIE	FREYA
ZOEY	RAVEN	DELILAH
CHLOE	PEARL	ZELDA
MOLLY	HARPER	ROSE
MILLIE	AVA	CALLIE
PENNY	OAKLEY	MINNIE
ATHENA	CALI	LACEY
LILY	JOSIE	MISTY
HARLEY	REMI	MISSY
ROXY	SKY	GEMMA
GINGER	PAISLEY	PIXIE
MIA	ASPEN	SHELBY
NOVA	LEXI	FINLEY
DIXIE	ROXIE	OREO
HONEY	STORM	EVIE
GRACIE	TILLY	KATIE
BELLE	DIAMOND	SUGAR
POPPY	EMBER	SALLY
HAZEL	HOLLY	LIBBY
PEPPER	GEORGIA	GYPSY
ANNIE	XENA	CORA
ELLA	PRINCESS	MABEL
SASHA	LILLY	PEACHES
IZZY	RILEY	KALI
SHADOW`.split(/\s+/)

;(async () => {
  for (let i = 0; i < 200; i++) {
    const gender = Math.floor(Math.random() * 2) === 0 ? 'Female' : 'Male'
    let name = { Female: femaleNames, Male: maleNames }[gender]
    name = name[Math.floor(Math.random() * 100)]
    const age = Math.floor(Math.random() * 10) + 1
    const location = 'Minatitlán'
    const species = ['Dog', 'Cat', 'Rabbit'][Math.floor(Math.random() * 3)]
    const newPet = { name, gender, age, species, location }
    const newPetToAdopt = { id: i + 1, name, species, location }
    await new Pet(newPet).save()
    await new AvailablePet(newPetToAdopt).save()
  }

  db.close()
})()
