% Module responsible for the computer plays

:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(random)).
:- use_module(library(system)).
              
:- include('minimax.pl').

% choose_move(+BoardIn, +Player, -BoardOut, +Lever)
% chooses the best move for the computer according to the level selected

% Level 1 - Random Play
choose_move(BoardIn, Player, BoardOut, 1) :-
        display_game(BoardIn, Player),
        valid_moves(BoardIn, Player, ListOfMoves),
        length(ListOfMoves, MovesSize),
        now(TS),
        setrand(TS),
        random(0, MovesSize, RandomMoveIndex),
        nth0(RandomMoveIndex, ListOfMoves, RandomMove),
        move(RandomMove, BoardIn, BoardOut, Player).

% Level 2 - Minimax with depth = 1 (greedy play)
choose_move(BoardIn, Player, BoardOut, 2) :-
        display_game(BoardIn, Player),
        minimax([Player|[BoardIn]], [_|[BoardOut]], _, 1).

% Level 3 - Minimax with depth = 2
choose_move(BoardIn, Player, BoardOut, 3) :-
        display_game(BoardIn, Player),
        minimax([Player|[BoardIn]], [_|[BoardOut]], _, 2).

% max_list(+L, -M, -I)
% get the maximum element of a list and it's index        
max_list(L, M, I) :- 
        nth0(I, L, M), 
        \+ (member(E, L), E > M).


% value(+Board, -Value)
% calculates the board's value
% positive numbers for player 1 (red) and negative for player 2 (green)
% 2 straight pieces - 1 point
% 3 straight pieces - 2 point
% 4 straight pieces - 5 point (wins)

value(Board, Value) :-
        game_over(Board, 1), Value is 5, !.

value(Board, Value) :-
        game_over(Board, 2), Value is -5, !.

value(Board, Value) :-
        value_for_player(Board, 1, RedValue),
        value_for_player(Board, 2, GreenValue),
        Value is RedValue - GreenValue.

value_for_player(Board, Player, Value) :-
        piece(Player, P),
        ((straight_3(P, Board), Value is 2, !) ;
         (straight_2(P, Board), Value is 1, !) ;
        (Value is 0, !)).

% straight_n(+Player, +Board), where n is 3 or 2
% checks if there is are any n straight pieces on the board, for a certain player

% checks for 3 straight pieces on the same row
straight_3(X, T):- append(_, [C|_], T), 
                   append(_,[X,X,X|_],C). 

% checks for 3 straight pieces on the same column
straight_3(X, T):- append(_,[C1,C2,C3|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   append(I3,[X|_],C3),
                   length(I1,M), length(I2,M), length(I3,M). 

% checks for 3 straight pieces on a left to right diagonal
straight_3(X, T):- append(_,[C1,C2,C3|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   append(I3,[X|_],C3),
                   length(I1,M1), length(I2,M2), length(I3,M3),
                   M2 is M1+1, M3 is M2+1.

% checks for 3 straight pieces on a right to left diagonal
straight_3(X, T):- append(_,[C1,C2,C3|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   append(I3,[X|_],C3),
                   length(I1,M1), length(I2,M2), length(I3,M3),
                   M2 is M1-1, M3 is M2-1. 

% checks for 2 straight pieces on the same row
straight_2(X, T):- append(_, [C|_], T), 
                   append(_,[X,X|_],C). 

% checks for 3 straight pieces on the same column
straight_2(X, T):- append(_,[C1,C2|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   length(I1,M), length(I2,M). 

% checks for 2 straight pieces on a left to right diagonal
straight_2(X, T):- append(_,[C1,C2|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   length(I1,M1), length(I2,M2),
                   M2 is M1+1.

% checks for 2 straight pieces on a right to left diagonal
straight_2(X, T):- append(_,[C1,C2|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   length(I1,M1), length(I2,M2),
                   M2 is M1-1. 

% getCPUPlacement(+BoardIn, +Player, -BoardOut, +Lever)
% chooses the best placement for the computer according to the level selected

% Level 1 - Random Placement
getCPUPlacement(BoardIn, Player, BoardOut, Level) :-
        Level is 1,
        display_game(BoardIn, Player), nl,
        valid_placements(BoardIn, LisfOfPlacements),
        length(LisfOfPlacements, PlacementsSize),
        now(TS),
        setrand(TS),
        random(0, PlacementsSize, RandomPlacementIndex),
        nth0(RandomPlacementIndex, LisfOfPlacements, RandomPlacement),                 
        place(RandomPlacement, BoardIn, BoardOut, Player).

% Level 2 - Minimax with depth of 2
getCPUPlacement(BoardIn, Player, BoardOut, Level) :-
        Level is 2,
        display_game(BoardIn, Player),
        minimax_placements([Player|[BoardIn]], [_|[BoardOut]], _, 2).

% Level 3 - Minimax with depth of 3
getCPUPlacement(BoardIn, Player, BoardOut, Level) :-
        Level is 3,
        display_game(BoardIn, Player),
        minimax_placements([Player|[BoardIn]], [_|[BoardOut]], _, 3).

        
        