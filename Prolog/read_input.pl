% Module responsible for reading user's input
 
:- use_module(library(lists)).

:- include('moves.pl').
:- include('CPU.pl').


initial_board([['0','0','.','0','0'],['0','.','.','.','0'],['.','.','0','.','.'],['0','.','.','.','0'],['0','0','.','0','0']]).

readMove(Input):-
        get_char(Ch),
        readRest(Ch, Input).

readRest('\n', []).
readRest(Ch, [Ch|Rest]) :-
        get_char(Ch1),
        readRest(Ch1, Rest).

getInitialPos(L, C) :-
        write('Piece Position:'),
        readMove(Pos), nl,
        nth0(0, Pos, LChar), nth0(1, Pos, CChar), 
        number_chars(L, [LChar]), number_chars(C, [CChar]).
        

getFinalPos(L, C) :-
        write('New Position:'),
        readMove(NewPos), nl,
        nth0(0, NewPos, NLChar), nth0(1, NewPos, NCChar),
        number_chars(L, [NLChar]), number_chars(C, [NCChar]).

piece(1, 'R').
piece(2, 'G').

getPlacingPos(L, C) :-
        write('Piece Position:'),
        readMove(Pos), nl,
        nth0(0, Pos, LChar), nth0(1, Pos, CChar), 
        number_chars(L, [LChar]), number_chars(C, [CChar]).

place([R,C], BoardIn, BoardOut, Player) :-
        piece(Player, P),
        valid_placements(BoardIn, ValidPlacements),
        member([R,C], ValidPlacements),
        setPiece(R, C, P, BoardIn, BoardOut).
        

%getPlayerPlacement(+BoardIn, +Player, -BoardOut).

getPlayerPlacement(BoardIn, Player, BoardOut) :-
        display_game(BoardIn, Player), nl,
        catch(getPlacingPos(R, C), Err, fail), 
        (place([R, C], BoardIn, BoardOut, Player) ;
         (write('Invalid Placement'), getPlayerPlacement(BoardIn, Player, BoardOut))).

getPlayerPlacement(BoardIn, Player, BoardOut) :-
        write('\nInvalid input! Try Again\n'), nl,
        getPlayerPlacement(BoardIn, Player, BoardOut).

getPositions(R, C, NR, NC) :-
        getInitialPos(R, C),
        getFinalPos(NR, NC).

        
%getPlayerMove(+BoardIn, +Player, -BoardOut).

getPlayerMove(BoardIn, Player, BoardOut) :-
        display_game(BoardIn, Player), nl,
        catch(getPositions(R, C, NR, NC), Err, fail),
        (move([R, C, NR, NC], BoardIn, BoardOut, Player);
         write('Invalid Move'), getPlayerMove(BoardIn, Player, BoardOut)). 

getPlayerMove(BoardIn, Player, BoardOut) :-
        write('\nInvalid input! Try Again\n'), nl,
        getPlayerMove(BoardIn, Player, BoardOut).


  
        

        