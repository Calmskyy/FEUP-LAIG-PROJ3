% Module responsible for the game's loop logic
  
:- use_module(library(lists)).

:- include('board.pl').
:- include('CPU.pl').

% game_over(+Board, +Player)
% checks if a given player already won the game
                           
game_over(Board, Player) :-
        piece(Player, P),
        wins(P, Board).

% wins(+Player, +Board)
% checks if there are 4 pieces straight

% checks for 4 straight pieces on the same row
wins(X, T):- append(_, [C|_], T), 
                   append(_,[X,X,X,X|_],C). 

% checks for 4 straight pieces on the same column
wins(X, T):- append(_,[C1,C2,C3,C4|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   append(I3,[X|_],C3),
                   append(I4,[X|_],C4),
                   length(I1,M), length(I2,M), length(I3,M), length(I4,M). 

% checks for 4 straight pieces on a left to right diagonal
wins(X, T):- append(_,[C1,C2,C3,C4|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   append(I3,[X|_],C3),
                   append(I4,[X|_],C4),
                   length(I1,M1), length(I2,M2), length(I3,M3), length(I4,M4),
                   M2 is M1+1, M3 is M2+1, M4 is M3+1. 

% checks for 4 straight pieces on a right to left diagonal
wins(X, T):- append(_,[C1,C2,C3,C4|_],T), 
                   append(I1,[X|_],C1), 
                   append(I2,[X|_],C2),
                   append(I3,[X|_],C3),
                   append(I4,[X|_],C4),
                   length(I1,M1), length(I2,M2), length(I3,M3), length(I4,M4),
                   M2 is M1-1, M3 is M2-1, M4 is M3-1. 
                   

getPlacement(Board, Player, BoardOut, GameType, _Level) :-
        GameType is 0,
        getPlayerPlacement(Board, Player, BoardOut).

getPlacement(Board, Player, BoardOut, GameType, Level) :-
        GameType is 1,
        ((Player is 1, getPlayerPlacement(Board, Player, BoardOut)) ;
         getCPUPlacement(Board, Player, BoardOut, Level)).

getPlacement(Board, Player, BoardOut, GameType, Level) :-
        GameType is 2,
        getCPUPlacement(Board, Player, BoardOut, Level).

fill_board(N, Player, BoardIn, BoardOut, GameType, CPULevel) :-
        N < 8 , !,
        NewN is N + 1,
        ActualPlayer is Player + 1,
        ((GameType is 2, getPlacement(BoardIn, ActualPlayer, BoardNext, GameType, 1), !) ;
         (getPlacement(BoardIn, ActualPlayer, BoardNext, GameType, CPULevel), !)),
        ((game_over(BoardNext, ActualPlayer), nl,
        write('      1   2   3   4   5'), nl,
        display_board(BoardOut, 1), nl,
        write('Player '), write(ActualPlayer), write(' Wins !!!'), nl, halt) ;
        (NewPlayer is Player + 1,
        NextPlayer is NewPlayer mod 2,
        fill_board(NewN, NextPlayer, BoardNext, BoardOut, GameType, CPULevel))).

fill_board(8, Player, BoardIn, BoardOut, GameType, CPULevel) :-
        BoardOut = BoardIn.
        
getMove(Board, Player, BoardOut, GameType, CPULevel) :-
        CPULevel is 0, GameType is 0,
        getPlayerMove(Board, Player, BoardOut).

getMove(Board, Player, BoardOut, GameType, CPULevel) :-
        GameType is 1,
        ((Player is 1, getPlayerMove(Board, Player, BoardOut)) ;
         choose_move(Board, Player, BoardOut, CPULevel)).

getMove(Board, Player, BoardOut, GameType, CPULevel) :-
        GameType is 2,
        choose_move(Board, Player, BoardOut, CPULevel).

play_game(_Player, Board, _GameType, _CPULevel, 0) :-
        nl, nl, write('      1   2   3   4   5'), nl,
        display_board(Board, 1), nl,
        write('!!!!!DRAW!!!!!').

play_game(Player, Board, GameType, CPULevel, Iteration) :-
        ActualPlayer is Player + 1,
        getMove(Board, ActualPlayer, BoardOut, GameType, CPULevel), !,
        ((game_over(BoardOut, ActualPlayer) , nl, nl,
        write('Player '), write(ActualPlayer), write(' Wins !!!'), nl , nl,
        write('      1   2   3   4   5'), nl,
        display_board(BoardOut, 1), nl); 
        (NewPlayer is Player + 1,
        NextPlayer is NewPlayer mod 2,
        NewIteration is Iteration - 1,
        play_game(NextPlayer, BoardOut, GameType, CPULevel, NewIteration))).



start_game(GameType, CPULevel) :-
        board(T),
        fill_board(0, 0, T, BoardOut, GameType, CPULevel),
        play_game(0, BoardOut, GameType, CPULevel, 50),
        start.

processSelectedOption(1) :-
        start_game(0, 0).

processSelectedOption(2) :-
        get_cpu_difficulty(Level),
        ((Level is 0, start) ;
        start_game(1, Level)).
   
processSelectedOption(3) :-
        get_cpu_difficulty(Level), 
        ((Level is 0, start) ;       
        start_game(2, Level)).

processSelectedOption(0).

get_cpu_difficulty(Level) :-
        nl, nl,
        write('################################'), nl,
        write('#                              #'), nl, 
        write('#         CPU DIFFICULTY       #'), nl,
        write('#                              #'), nl,
        write('#  1 - Easy                    #'), nl,
        write('#                              #'), nl,
        write('#  2 - Medium                  #'), nl,
        write('#                              #'), nl,
        write('#  3 - Hard                    #'), nl,
        write('#                              #'), nl,
        write('#  0 - Back                    #'), nl,
        write('#                              #'), nl,
        write('################################'), nl, nl,
        write('Select Option:'), catch(readMove(Option), _Err, (write('\n\n Invalid Option!!!'),get_cpu_difficulty(Level), fail)),
        number_chars(OptionInt, Option),
        ((OptionInt > 3, write('\n\n Invalid Option!!!'), get_cpu_difficulty(Level)) ;
         Level is OptionInt).
        
start :-
        nl, nl,
        write('################################'), nl,
        write('#                              #'), nl, 
        write('#          STRAIGHT 4          #'), nl,
        write('#                              #'), nl,
        write('#  1 - Player vs Player        #'), nl,
        write('#                              #'), nl,
        write('#  2 - Player vs Computer      #'), nl,
        write('#                              #'), nl,
        write('#  3 - Computer vs Computer    #'), nl,
        write('#                              #'), nl,
        write('#  0 - Quit                    #'), nl,
        write('#                              #'), nl,
        write('################################'), nl, nl,
        write('Select Option:'), catch(readMove(Input), _Err, (write('\n\n Invalid Option!!!'),start, fail)),
        number_chars(Option, Input),
        ((Option > 3, write('\n\n Invalid Option!!!'), start) ;
        processSelectedOption(Option)).
                                                       