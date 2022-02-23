(define (problem problema_puerto_recursos)
(:domain puerto_recursos)
(:objects caja3 caja4 caja7 - objetivo 
          caja1 caja2 caja5 caja6 caja8 caja9 caja10 caja11 - noObjetivo
          muelle1 muelle2 - muelle
          grua1 grua2 - grua
          cinta12 cinta21 - cinta
          pila11 pila12 pila13 pila21 pila22 pila23 - pila)

(:init (en muelle1 caja1)(en muelle1 caja7)(en muelle1 caja9)(en muelle1 caja10)(en muelle1 caja11)(en muelle1 grua1)(en muelle1 pila11)(en muelle1 pila12)(en muelle1 pila13) ;Objetos en el muelle 1.
       (en muelle2 caja2)(en muelle2 caja3)(en muelle2 caja4)(en muelle2 caja5)(en muelle2 caja6)(en muelle2 caja8)(en muelle2 grua2)(en muelle2 pila21)(en muelle2 pila22)(en muelle2 pila23) ;Objetos en el muelle 2.
       (libre grua1)(libre grua2)(libre cinta12)(une cinta12 muelle1 muelle2)(libre cinta21)(une cinta21 muelle2 muelle1) ;Estado de los objetos ocupables.
       (noDisponible pila11)(disponible caja1)(disponible caja7)(noDisponible pila12)(noDisponible caja9)(disponible caja10)(noDisponible pila13)(disponible caja11) ;Disponiblidad de los elementos el muelle 1.
       (cima pila11 caja7)(sobre pila11 caja1)(sobre caja1 caja7)(cima pila12 caja10)(sobre pila12 caja9)(sobre caja9 caja10)(cima pila13 caja11)(sobre pila13 caja11) ;Orden de apilamiento de los objetos del muelle 1.
       (disponible pila21)(noDisponible caja4)(disponible caja8)(noDisponible pila22)(disponible caja5)(noDisponible caja3)(disponible caja2)(noDisponible pila23)(disponible caja6) ;Disponiblidad de los elementos el muelle 2.
       (cima pila21 caja8)(sobre pila21 caja4)(sobre caja4 caja8)(cima pila22 caja2)(sobre pila22 caja5)(sobre caja5 caja3)(sobre caja3 caja2)(cima pila23 caja6)(sobre pila23 caja6) ;Orden de apilamiento de los objetos del muelle 2.
       (= (altura pila11) 2)
       (= (altura pila12) 2)
       (= (altura pila13) 1)
       (= (altura pila21) 2)
       (= (altura pila22) 3)
       (= (altura pila23) 1)

       (= (altura-gruas) 10)

       (= (peso caja1) 2)
       (= (peso caja2) 1)
       (= (peso caja3) 2)
       (= (peso caja4) 3)
       (= (peso caja5) 4)
       (= (peso caja6) 1)
       (= (peso caja7) 5)
       (= (peso caja8) 1)
       (= (peso caja9) 2)
       (= (peso caja10) 4)
       (= (peso caja11) 3)
       
       (= (distancia muelle1 muelle2) 7) 
       (= (distancia muelle2 muelle1) 10)

       (= (velocidad-lenta) 1)
       (= (velocidad-rapida) 2)

       (= (combustible cinta12) 100)
       (= (combustible cinta21) 50)
       (= (combustible-usado) 0)

       (= (ratio-repostaje) 0.25)
       (= (tam-deposito) 125)
       )

(:goal (and 
              (disponible caja3)
              (disponible caja4)
              (disponible caja7)
              (en muelle1 caja3)
              (en muelle1 caja4)
              (en muelle1 caja7)))
(:metric minimize (combustible-usado))
)