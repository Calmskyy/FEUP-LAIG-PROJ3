% Module responsible for displaying the board
           
:- use_module(library(lists)).

:- include('read_input.pl').
:- dynamic board/1.

board([['0','0','.','0','0'],['0','.','.','.','0'],['.','.','0','.','.'],['0','.','.','.','0'],['0','0','.','0','0']]).

display_line:-
        write('    |---|---|---|---|---|').

display_board([], N) :-
        write('    |---|---|---|---|---|').

display_board([H|T], N) :-
        display_line, nl,
        write(' '), write(N),
        X is N + 1,
        write('  | '),
        display_board_row(H), nl,
        display_board(T, X).
        
display_board_row([]).

display_board_row([H|T]) :-
        ((H = '0', write(' ')) ; write(H)),
        write(' | '),
        display_board_row(T).

player(1) :- write('Player: RED(1)').
player(2) :- write('Player: GREEN(2)').
     
%display_game(+Board, +Player).

display_game([H|T], Player) :-
        nl, player(Player), nl, nl,
        write('      1   2   3   4   5'), nl,
        display_board([H|T], 1).


               
        
                        













