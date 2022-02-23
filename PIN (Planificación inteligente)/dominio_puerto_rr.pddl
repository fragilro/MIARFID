;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; PUERTO
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define (domain puerto_recursos)
    (:requirements :strips :typing :disjunctive-preconditions :durative-actions :fluents) 
    (:types   objetivo noObjetivo - caja  ;Indica si la caja en cuestión es objetivo (verde) o no (gris).
              caja pila - objeto          ;Se puede determinar su disponiilidad
              cinta grua - ocupable       ;Trabajan con cajas y pueden estar ocupados o libres
              objeto grua - localizable   ;Estan situados en algun muelle
              muelle)

    (:predicates (en ?muelle - muelle ?elemento - localizable)        ;En qué muelle está la entidad x.
                 (sobre ?objeto_inferior - objeto ?caja - caja)            ;Sobre qué se situa la caja c.
                 (cima ?pila - pila ?objeto_cima - objeto)             ;Qué caja c es la cima de la pila p.
                 (disponible ?objeto - objeto)               ;Etiqueta de disponibilidad de la pila o caja o.
                 (noDisponible ?objeto - objeto)             ;Etiqueta de no disponibilidad de la pila o caja o.
                 (libre ?grua_o_cinta - ocupable)                  ;La grua o cinta está vacia.
                 (ocupado ?grua_o_cinta - ocupable ?caja - caja)                ;La grua o cinta está trabajando con alguna caja.
                 (une ?cinta - cinta ?muelle_1 - muelle ?muelle_2 - muelle)) ;Qué dos muelles conecta la cinta z.
    (:functions
                 (altura ?p - pila)
                 (distancia ?m1 - muelle ?m2 - muelle)
                 (peso ?c - caja)
                 (altura-gruas)
                 (velocidad-rapida)
                 (velocidad-lenta)
                 (combustible ?k - cinta)
                 (combustible-usado)
                 (ratio-repostaje)
                 (tam-deposito)
                 )


    ;Coge con la grua g del muelle l una caja c objetivo que se encuentra sobre la pila p encima del objeto oinferior y la pila pasa de tener altura ni a tener altura no.
    (:durative-action desapilarObjetivo
	    :parameters (?g - grua ?l - muelle ?c - objetivo ?p - pila ?oinferior - objeto)
        :duration (= ?duration (/ (- (altura-gruas) (altura ?p)) (/ 3 (peso ?c))))
	    :condition 
            (and 
                (over all (en ?l ?g))
                (over all (en ?l ?p))
                (at start (cima ?p ?c))
                (at start (sobre ?oinferior ?c))
                (at start (libre ?g)))
        :effect
            (and
                (at start (not (cima ?p ?c)))
                (at start (not (sobre ?oinferior ?c)))
                (at start (decrease (altura ?p) 1))
                (at start (not (libre ?g)))
                (at start (cima ?p ?oinferior))
                (at start (ocupado ?g ?c))))

    
    ;Coge con la grua g del muelle l una caja c no objetivo que se encuentra sobre la pila p encima del objeto oinferior y la pila pasa de tener altura ni a tener altura no.
    (:durative-action desapilarNoObjetivo 
	    :parameters (?g - grua ?l - muelle ?c - noObjetivo ?p - pila ?oinferior - objeto)
        :duration (= ?duration (/ (- (altura-gruas) (altura ?p)) (/ 3 (peso ?c))))
	    :condition 
            (and 
                (over all (en ?l ?g))
                (over all (en ?l ?p))
                (at start (cima ?p ?c))
                (at start (sobre ?oinferior ?c))
                (at start (libre ?g))
                (over all (noDisponible ?oinferior)))
        :effect
            (and
                (at start (not (cima ?p ?c)))
                (at end   (not (noDisponible ?oinferior)))
                (at start (not (sobre ?oinferior ?c)))
                (at start (not (libre ?g)))
                (at start (cima ?p ?oinferior))
                (at end (disponible ?oinferior))
                (at start (decrease (altura ?p) 1))
                (at start (ocupado ?g ?c))))


    ;Deja una caja c objetivo sostenida por la grua g del muelle l sobre la pila p con objeto superior oinferior y la cuál pasa de tener altura ni a altura no.
    (:durative-action ApilarObjetivo
	    :parameters (?g - grua ?l - muelle ?c - objetivo ?p - pila ?oinferior - objeto)
        :duration (= ?duration (/ (- (altura-gruas) (altura ?p)) (/ 3 (peso ?c))))
	    :condition 
            (and 
                (over all (en ?l ?g))
                (over all (en ?l ?p))
                (over all (cima ?p ?oinferior))
                (over all (ocupado ?g ?c)))
        :effect
            (and
                (at end (not (ocupado ?g ?c)))
                (at end (not (cima ?p ?oinferior)))
                (at end (libre ?g))
                (at end (cima ?p ?c))
                (at end (sobre ?oinferior ?c))
                (at end (cima ?p ?c))
                (at end (increase (altura ?p) 1))))

    ;Deja una caja c no objetivo sostenida por la grua g del muelle l sobre la pila p con objeto superior oinferior y la cuál pasa de tener altura ni a altura no.
    (:durative-action ApilarNoObjetivo
	    :parameters (?g - grua ?l - muelle ?c - noObjetivo ?p - pila ?oinferior - objeto)
        :duration (= ?duration (/ (- (altura-gruas) (altura ?p)) (/ 3 (peso ?c))))
	    :condition 
            (and 
                (over all (en ?l ?g))
                (over all (en ?l ?p))
                (over all (cima ?p ?oinferior))
                (over all (ocupado ?g ?c)))
        :effect
            (and
                (at end (not (ocupado ?g ?c)))
                (at end (not (cima ?p ?oinferior)))
                (at end (not (disponible ?oinferior)))
                (at end (libre ?g))
                (at end (cima ?p ?c))
                (at end (sobre ?oinferior ?c))
                (at end (cima ?p ?c))
                (at end (increase (altura ?p) 1))
                (at end (noDisponible ?oinferior))))

    ;
    (:durative-action dejarCinta
        :parameters (?l - muelle ?l2 - muelle ?k - cinta ?g - grua ?c - caja)
        :duration   (= ?duration (/ (- (altura-gruas) 1) (/ 3 (peso ?c))))
        :condition 
            (and 
                (at start (une ?k ?l ?l2))
                (over all (en ?l ?g))
                (over all (en ?l ?c))
                (over all (ocupado ?g ?c))
                (at start (libre ?k)))
        :effect
            (and 
                (at end (not (ocupado ?g ?c)))
                (at start (not (libre ?k)))
                (at start (ocupado ?k ?c))
                (at end (libre ?g))))

    ;
    (:durative-action moverCintaLento
        :parameters (?l1 - muelle ?l2 - muelle ?k - cinta ?c - caja)
        :duration   (= ?duration (/ (distancia ?l1 ?l2) (velocidad-lenta)))
        :condition 
            (and 
                (at start (>= (combustible ?k) (/ 50 (/ (distancia ?l1 ?l2) (velocidad-lenta)))))
                (at start (une ?k ?l1 ?l2))
                (at start (en ?l1 ?c))
                (over all (ocupado ?k ?c)))
        :effect
            (and 
                (at end (increase (combustible-usado) (/ 50 (/ (distancia ?l1 ?l2) (velocidad-lenta)))))
                (at end (decrease (combustible ?k) (/ 50 (/ (distancia ?l1 ?l2) (velocidad-lenta)))))
                (at start (not (en ?l1 ?c))) 
                (at end (en ?l2 ?c))))

    (:durative-action moverCintaRapido
        :parameters (?l1 - muelle ?l2 - muelle ?k - cinta ?c - caja)
        :duration   (= ?duration (/ (distancia ?l1 ?l2) (velocidad-rapida)))
        :condition 
            (and 
                (at start (>= (combustible ?k) (/ 50 (/ (distancia ?l1 ?l2) (velocidad-rapida)))))
                (at start (une ?k ?l1 ?l2))
                (at start (en ?l1 ?c))
                (over all (ocupado ?k ?c)))
        :effect
            (and 
                (at end (increase (combustible-usado) (/ 50 (/ (distancia ?l1 ?l2) (velocidad-rapida)))))
                (at end (decrease (combustible ?k) (/ 50 (/ (distancia ?l1 ?l2) (velocidad-rapida)))))
                (at start (not (en ?l1 ?c))) 
                (at end (en ?l2 ?c))))

    ;
    (:durative-action cogerCinta
        :parameters (?l - muelle ?k - cinta ?g - grua ?c - caja)
        :duration   (= ?duration (/ (- (altura-gruas) 1) (/ 3 (peso ?c))))
        :condition 
            (and 
                (over all (en ?l ?c))
                (over all (en ?l ?g)) 
                (at start (ocupado ?k ?c))
                (at start (libre ?g)))
        :effect
            (and 
                (at start (not (ocupado ?k ?c))) 
                (at start (not (libre ?g)))
                (at start (ocupado ?g ?c)) 
                (at start (libre ?k))))

    (:durative-action repostarCinta
        :parameters (?k - cinta)
        :duration   (= ?duration (* (- (tam-deposito) (combustible ?k)) (ratio-repostaje)))
        :condition 
            (and 
                (at start (>= (/ (tam-deposito) 2) (combustible ?k))))
        :effect
            (and 
                (at end (assign (combustible ?k) (tam-deposito)))))
)




 