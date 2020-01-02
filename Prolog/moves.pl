% Module responsible for the game moves
      
:- use_module(library(lists)).
:- use_module(library(between)).

% getPiece(+Row, +Column, +Board, -Piece).
% Gets piece on a specific position
getPiece(Nrow, Ncolumn, Board, Piece) :-
        nth1(Nrow, Board, Row),
        nth1(Ncolumn, Row, Piece).

% setPiece(+Nrow, +Ncolumn, +Piece, +BoardIn, -BoardOut).
% Sets piece on a specific position

setPiece(Nrow, Ncolumn, Piece, BoardIn, BoardOut) :-
        setRow(Nrow, Ncolumn, Piece, BoardIn, BoardOut).

setRow(1, Ncolumn, Piece, [Row | Rest], [NewRow |Rest]) :-
        setColumn(Ncolumn, Piece, Row, NewRow).

setRow(N, Ncolumn, Piece, [Row | Rest], [Row | MoreRows]) :-
        N > 1,
        Next is N - 1,
        setRow(Next, Ncolumn, Piece, Rest, MoreRows).

setColumn(1, Piece, [_|Rest], [Piece|Rest]).

setColumn(N, Piece, [X|Rest], [X|More]) :-
        N > 1,
        Next is N - 1,
        setColumn(Next, Piece, Rest, More).

% movePiece(+Piece, +Row, +Column, +NewRow, +NewColumn, +BoardIn, -BoardOut)
% Moves a piece from one position to another

movePiece(Piece, Row, Column, NewRow, NewColumn, BoardIn, BoardOut) :-
        getPiece(Row, Column, BoardIn, P),
        P = Piece,
        setPiece(Row, Column, '0',  BoardIn, T),
        setPiece(NewRow, NewColumn, Piece, T, BoardOut).

% valid_placements(+BoardIn, -ValidPlacements)
% calculates all valid placements for a given board

valid_placements(BoardIn, ValidPlacements) :-
        findall([Row, Column], valid_placement(BoardIn, Row, Column), ValidPlacements).

valid_placement(BoardIn, Row, Column) :-
        inside_board(Row, Column),
        is_empty(BoardIn, Row, Column).  
    
% valid_moves(+BoardIn, +Player, -ValidMoves)
% calculates all valid moves for a given board and player
                  
valid_moves(Board, Player, ListOfMoves) :-
        findall([Row, Column, NewRow, NewColumn], valid_play(Board, Player, Row, Column, NewRow, NewColumn), ListOfMovesWithDuplicates),
        sort(ListOfMovesWithDuplicates, ListOfMoves).

% valid_play(+BoardIn, +Player, +Row, +Column, +NewRow, +NewColumn)
% checks if a given move is valid

valid_play(BoardIn, Player, Row, Column, NewRow, NewColumn) :-
        inside_board(Row, Column),
        inside_board(NewRow, NewColumn), 
        check_piece(BoardIn, Player, Row, Column), 
        is_empty(BoardIn, NewRow, NewColumn), 
        valid_move(BoardIn, Row, Column, NewRow, NewColumn).

inside_board(Row, Column) :-
        between(1, 5, Row),
        between(1, 5, Column).

piece(1, 'R').
piece(2, 'G').

check_piece(BoardIn, Player, Row, Column) :-
        Player is 1,
        piece(Player, PlayerPiece),
        getPiece(Row, Column, BoardIn, P),
        P == PlayerPiece.

check_piece(BoardIn, Player, Row, Column) :-
        Player is 2,
        piece(Player, PlayerPiece),
        getPiece(Row, Column, BoardIn, P),
        P == PlayerPiece.

is_empty(BoardIn, Row, Column) :-
        getPiece(Row, Column, BoardIn, P),
        (P == '0' ; P == '.').

initial_board([['0','0','.','0','0'],['0','.','.','.','0'],['.','.','0','.','.'],['0','.','.','.','0'],['0','0','.','0','0']]).

% caso da peca estar num '.' => pode-se movimentar na horizontal/vertical ou para outro '.' adjacente
valid_move(BoardIn, Row, Column, NewRow, NewColumn) :-
        initial_board(InitBoard),
        getPiece(Row, Column, InitBoard, P),
        P == '.',
        getPiece(NewRow, NewColumn, BoardIn, T),
        RowDiff is abs(NewRow - Row), RowDiff @< 2,
        ColumnDiff is abs(NewColumn - Column), ColumnDiff @< 2,
        (((ColumnDiff == 1, RowDiff == 0) ; (ColumnDiff == 0, RowDiff == 1))  ; T == '.'). %movimento vertical/horizontal ou seguindo linhas

% caso da peca estar num '.' => pode-se movimentar na horizontal/vertical 
valid_move(_BoardIn, Row, Column, NewRow, NewColumn) :-
        initial_board(InitBoard),
        getPiece(Row, Column, InitBoard, P),
        P == '0',
        RowDiff is abs(NewRow - Row), RowDiff @< 2,
        ColumnDiff is abs(NewColumn - Column), ColumnDiff @< 2,
        ((ColumnDiff == 1, RowDiff == 0) ; (ColumnDiff == 0, RowDiff == 1)). %movimento vertical/horizontal 

% move(+move, +BoardIn, -BoardOut, +Player)
% tries to move a given piece after checking if it's a valid play
move([R,C,NR,NC], BoardIn, BoardOut, Player) :-
        valid_moves(BoardIn, Player, ValidMoves), 
        member([R,C,NR,NC], ValidMoves),
        getPiece(R, C, BoardIn, P),
        movePiece(P, R, C, NR, NC, BoardIn, AuxBoardOut),
        initial_board(BoardInit),
        getPiece(R, C, BoardInit, PlaceHolder),
        setPiece(R, C, PlaceHolder, AuxBoardOut, BoardOut).


                                    
                     

         
        
        

