% Module responsible for the minimax algorithm

valid_boards(Pos, PosList) :-
        nth0(0, Pos, Player),
        Player is 1,
        nth0(1, Pos, Board),
        findall([2, BoardOut], (valid_moves(Board, Player, MoveList), member(Move, MoveList), move(Move, Board, BoardOut, Player)), PosListWithDuplicates),
        sort(PosListWithDuplicates, PosList).

valid_boards(Pos, PosList) :-
        nth0(0, Pos, Player),
        Player is 2,
        nth0(1, Pos, Board),
        findall([1, BoardOut], (valid_moves(Board, Player, MoveList), member(Move, MoveList), move(Move, Board, BoardOut, Player)), PosListWithDuplicates),
        sort(PosListWithDuplicates, PosList).

minimax(Pos, BestNextPos, Val, 0) :-
        get_minimax_value(Pos, Val), !.

minimax(Pos, BestNextPos, Val, Depth):- 
        valid_boards(Pos, NextPosList),
        best(NextPosList, BestNextPos, Val, Depth).

minimax(Pos, _, Val, Depht) :-
        get_minimax_value(Pos, Val), !.

best([Pos], Pos, Val, Depht) :-
        NewDepht is Depht - 1,
        minimax(Pos, _, Val, NewDepht), !.

best([Pos1 | PosList], BestPos, BestVal, Depht) :-
        NewDepht is Depht - 1,
        minimax(Pos1, _, Val1, NewDepht),
        best(PosList, Pos2, Val2, Depht),
        betterOf(Pos1, Val1, Pos2, Val2, BestPos, BestVal).
        
betterOf(Pos0, Val0, _, Val1, Pos0, Val0) :-   % Pos0 better than Pos1
    min_to_move(Pos0),                         % MIN to move in Pos0
    Val0 > Val1, !                             % MAX prefers the greater value
    ;
    max_to_move(Pos0),                         % MAX to move in Pos0
    Val0 < Val1, !.                            % MIN prefers the lesser value

betterOf(_, _, Pos1, Val1, Pos1, Val1).

min_to_move([2|_]).
max_to_move([1|_]).
        
get_minimax_value([Player|Board], Val):-
        nth0(1, [Player|Board], ActualBoard), !,
        value(ActualBoard, Val).




valid_initial_boards(Pos, PosList) :-
        nth0(0, Pos, Player),
        Player is 1,
        nth0(1, Pos, Board),
        findall([2, BoardOut], (valid_placements(Board, MoveList), member(Move, MoveList), place(Move, Board, BoardOut, Player)), PosListWithDuplicates),
        sort(PosListWithDuplicates, PosList).

valid_initial_boards(Pos, PosList) :-
        nth0(0, Pos, Player),
        Player is 2,
        nth0(1, Pos, Board),
        findall([1, BoardOut], (valid_placements(Board, MoveList), member(Move, MoveList), place(Move, Board, BoardOut, Player)), PosListWithDuplicates),
        sort(PosListWithDuplicates, PosList).

minimax_placements(Pos, BestNextPos, Val, 0) :-
        get_minimax_value(Pos, Val), !.
                              
minimax_placements(Pos, BestNextPos, Val, Depth):- 
        valid_initial_boards(Pos, NextPosList),
        best_placements(NextPosList, BestNextPos, Val, Depth).

minimax_placements(Pos, _, Val, Depht) :-
        get_minimax_value(Pos, Val), !.

best_placements([Pos], Pos, Val, Depht) :-
        NewDepht is Depht - 1,
        minimax_placements(Pos, _, Val, NewDepht), !.

best_placements([Pos1 | PosList], BestPos, BestVal, Depht) :-
        NewDepht is Depht - 1,
        minimax_placements(Pos1, _, Val1, NewDepht),
        best_placements(PosList, Pos2, Val2, Depht),
        betterOf(Pos1, Val1, Pos2, Val2, BestPos, BestVal).
        