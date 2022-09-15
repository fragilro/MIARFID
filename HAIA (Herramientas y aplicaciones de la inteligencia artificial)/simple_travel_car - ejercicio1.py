import pyhop
from math import sqrt, pow

def distance(c1, c2):
    x=pow(c1['X']-c2['X'],2)
    y=pow(c1['Y']-c2['Y'],2)
    return sqrt(x+y)

def select_new_city(state,y):  #evaluation function
    x=state.location
    best=5000 #big int
    for c in state.connection.keys():
        if c not in state.path and c in state.connection[x]:
            g=state.cost
            h=distance(state.coordinates[c],state.coordinates[y])
            if g+h<best:
                best_city=c
                best=g+h
    return best_city

def travel_op(state,y):
    x=state.location
    if y in state.connection[x]:
        state.location = y
        state.path.append(y)
        state.cost += distance(state.coordinates[x],state.coordinates[y])
        return state
    else: return False

pyhop.declare_operators(travel_op)
print('')
pyhop.print_operators()

def travel_m(state,goal):
    x=state.location
    y=goal.final
    if x!=y:
        z=select_new_city(state,y)
        g=pyhop.Goal('g')
        g.final=y
        return [('travel_op',z), ('travel',g)]
    return False

def already_there(state,goal):
    x=state.location
    y=goal.final
    if x==y:
        return []
    return False

pyhop.declare_methods('travel',travel_m, already_there)
print('')
pyhop.print_methods()

#INITIAL STATE

state1 = pyhop.State('state1')
state1.coordinates = {'Huelva':{'X':25,'Y':275}, 'Cadiz':{'X':200,'Y':50}, 'Sevilla':{'X':250,'Y':325},
                      'Cordoba':{'X':475,'Y':450}, 'Malaga':{'X':550,'Y':100}, 'Jaen':{'X':750,'Y':425},
                      'Granada':{'X':800,'Y':250}, 'Almeria':{'X':1000,'Y':150}, 'Madrid':{'X':750,'Y':750}}
state1.connection = {'Huelva':{'Sevilla'}, 'Sevilla':{'Cadiz','Huelva','Cordoba','Malaga'},
                     'Cadiz':{'Sevilla','Malaga'}, 'Cordoba':{'Sevilla','Malaga','Jaen'},
                     'Malaga':{'Cadiz','Huelva','Cordoba','Sevilla','Granada','Almeria'},
                     'Jaen':{'Cordoba','Granada'},'Granada':{'Jaen','Malaga','Almeria'},
                     'Almeria':{'Granada','Malaga'}, 'Madrid':{'Jaen','Sevilla'}}
state1.location = 'Madrid'
state1.path = ['Madrid']
state1.cost = 0

#GOAL
goal1 = pyhop.Goal('goal1')
goal1.final = 'Malaga'

print('- If verbose=3, Pyhop also prints the intermediate states:')


pyhop.pyhop(state1,[('travel',goal1)],verbose=1)

"""
Importante para depurar:

Necesitamos: import pdb

Ponemos la instruccion "pdb.set_trace()" donde queramos en nuestro codigo y se detendra la ejecucion
Luego simplemente escribimos la letra 'n' desde el shell que ejecutara la siguiente sentencia y podemos ir
viendo el valor de las variables
"""
