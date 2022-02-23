;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; PUERTO
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define (domain puerto_2)
    (:requirements :strips :typing :disjunctive-preconditions) 
    (:types   objetivo noObjetivo - caja  ;Indica si la caja en cuestión es objetivo (verde) o no (gris).
              caja pila - objeto          ;Se puede determinar su disponiilidad
              cinta grua - ocupable       ;Trabajan con cajas y pueden estar ocupados o libres
              objeto grua - localizable   ;Estan situados en algun muelle
              muelle 
              nivel)

    (:predicates (en ?muelle - muelle ?elemento - localizable)        ;En qué muelle está la entidad x.
                 (sobre ?objeto_inferior - objeto ?caja - caja)            ;Sobre qué se situa la caja c.
                 (cima ?pila - pila ?objeto_cima - objeto)             ;Qué caja c es la cima de la pila p.
                 (disponible ?objeto - objeto)               ;Etiqueta de disponibilidad de la pila o caja o.
                 (noDisponible ?objeto - objeto)             ;Etiqueta de no disponibilidad de la pila o caja o.
                 (libre ?grua_o_cinta - ocupable)                  ;La grua o cinta está vacia.
                 (ocupado ?grua_o_cinta - ocupable ?caja - caja)                ;La grua o cinta está trabajando con alguna caja.
                 (une ?cinta - cinta ?muelle_1 - muelle ?muelle_2 - muelle) ;Qué dos muelles conecta la cinta z.
                 (next ?muelle - muelle  ?nivel_inferior - nivel ?nivel_superior - nivel);Predicado auxiliar para el control de niveles de una pila.
                 (altura ?pila - pila ?altura_en_niveles - nivel))            ;Altura actual de la pila p.


    ;Coge con la grua g del muelle l una caja c objetivo que se encuentra sobre la pila p encima del objeto oinferior y la pila pasa de tener altura ni a tener altura no.
    (:action desapilarObjetivo
	    :parameters (?g - grua ?l - muelle ?c - objetivo ?p - pila ?ni - nivel ?no - nivel ?oinferior - objeto)
	    :precondition 
            (and 
                (en ?l ?g)
                (en ?l ?p)
                (cima ?p ?c)
                (sobre ?oinferior ?c)
                (next ?l ?no ?ni)
                (altura ?p ?ni)
                (libre ?g))
        :effect
            (and
                (not (cima ?p ?c))
                (not (sobre ?oinferior ?c))
                (not (altura ?p ?ni))
                (not (libre ?g))
                (cima ?p ?oinferior)
                (altura ?p ?no)
                (ocupado ?g ?c)))

    
    ;Coge con la grua g del muelle l una caja c no objetivo que se encuentra sobre la pila p encima del objeto oinferior y la pila pasa de tener altura ni a tener altura no.
    (:action desapilarNoObjetivo 
	    :parameters (?g - grua ?l - muelle ?c - noObjetivo ?p - pila ?ni - nivel ?no - nivel ?oinferior - objeto)
	    :precondition 
            (and 
                (en ?l ?g)
                (en ?l ?p)
                (cima ?p ?c)
                (sobre ?oinferior ?c)
                (next ?l ?no ?ni)
                (altura ?p ?ni)
                (libre ?g))
                ;(noDisponible ?oinferior)
        :effect
            (and
                (not (cima ?p ?c))
                (not (noDisponible ?oinferior))
                (not (sobre ?oinferior ?c))
                (not (altura ?p ?ni))
                (not (libre ?g))
                (cima ?p ?oinferior)
                (disponible ?oinferior)
                (altura ?p ?no)
                (ocupado ?g ?c)))


    ;Deja una caja c objetivo sostenida por la grua g del muelle l sobre la pila p con objeto superior oinferior y la cuál pasa de tener altura ni a altura no.
    (:action ApilarObjetivo
	    :parameters (?g - grua ?l - muelle ?c - objetivo ?p - pila ?ni - nivel ?no - nivel ?oinferior - objeto)
	    :precondition 
            (and 
                (en ?l ?g)
                (en ?l ?p)
                (cima ?p ?oinferior)
                (next ?l ?ni ?no)
                (altura ?p ?ni)
                (ocupado ?g ?c))
        :effect
            (and
                (not (altura ?p ?ni))
                (not (ocupado ?g ?c))
                (not (cima ?p ?oinferior))
                (libre ?g)
                (cima ?p ?c)
                (sobre ?oinferior ?c)
                (cima ?p ?c)
                (altura ?p ?no)))

    ;Deja una caja c no objetivo sostenida por la grua g del muelle l sobre la pila p con objeto superior oinferior y la cuál pasa de tener altura ni a altura no.
    (:action ApilarNoObjetivo
	    :parameters (?g - grua ?l - muelle ?c - noObjetivo ?p - pila ?ni - nivel ?no - nivel ?oinferior - objeto)
	    :precondition 
            (and 
                (en ?l ?g)
                (en ?l ?p)
                (cima ?p ?oinferior)
                (next ?l ?ni ?no)
                (altura ?p ?ni)
                (ocupado ?g ?c))
        :effect
            (and
                (not (altura ?p ?ni))
                (not (ocupado ?g ?c))
                (not (cima ?p ?oinferior))
                (not (disponible ?oinferior))
                (libre ?g)
                (cima ?p ?c)
                (sobre ?oinferior ?c)
                (cima ?p ?c)
                (altura ?p ?no)
                (noDisponible ?oinferior)))

    ;
    (:action dejarCinta
        :parameters (?l - muelle ?l2 - muelle ?k - cinta ?g - grua ?c - caja)
        :precondition 
            (and 
                (or (une ?k ?l ?l2)(une ?k ?l2 ?l))
                (en ?l ?g) 
                (en ?l ?c )
                (ocupado ?g ?c)
                (libre ?k))
        :effect
            (and 
                (not (ocupado ?g ?c)) 
                (not (libre ?k))
                (ocupado ?k ?c) 
                (libre ?g)))

    ;
    (:action moverCinta
        :parameters (?l1 - muelle ?l2 - muelle ?k - cinta ?c - caja)
        :precondition 
            (and 
                (une ?k ?l1 ?l2)
                (en ?l1 ?c)
                (ocupado ?k ?c))
        :effect
            (and 
                (not (en ?l1 ?c)) 
                (en ?l2 ?c)))

    ;
    (:action cogerCinta
        :parameters (?l - muelle ?k - cinta ?g - grua ?c - caja)
        :precondition 
            (and 
                (en ?l ?c) 
                (en ?l ?g) 
                (ocupado ?k ?c)
                (libre ?g))
        :effect
            (and 
                (not (ocupado ?k ?c)) 
                (not (libre ?g))
                (ocupado ?g ?c) 
                (libre ?k)))
)




 