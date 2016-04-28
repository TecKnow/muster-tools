#!/usr/bin/env python2

import collections
import constraint
import itertools
import math
from pprint import pprint
from muster.test.roster_generator import RosterGenerator


PlayerName = collections.namedtuple(
    'PlayerName',
    ['surname',
     'forename'])
TableAssignment = collections.namedtuple(
    'TableAssignment',
    ['player_name',
     'table'])

MIN_TABLE_SIZE = 3
MAX_TABLE_SIZE = 7


class ConstraintMuster():

    def __init__(self,
                 num_players,
                 max_group_size,
                 min_table_size=None,
                 max_table_size =None):
        self.min_table_size = (min_table_size if min_table_size is not None
                               else MIN_TABLE_SIZE)
        self.max_table_size = (max_table_size if max_table_size is not None
                               else MAX_TABLE_SIZE)
        self.roster_generator = RosterGenerator()
        self.player_groups = self.roster_generator.generate_player_groups(
            num_players,
            max_group_size)
        self.player_names = tuple(
            sorted(
                PlayerName._make(name)
                for group in self.player_groups
                for name in group))
        self.max_tables = int(
            math.floor(
                float(num_players)/self.min_table_size))

        # Create the variable names and group them up.
        self.variable_field = tuple(
            itertools.product(
                self.player_names,
                range(1, self.max_tables+1)))
        self.variable_field = tuple(
            TableAssignment._make(x)
            for x in self.variable_field)

        self.players_by_table = dict()
        for table_number in range(1, self.max_tables+1):
            self.players_by_table[table_number] = tuple(
                current_assignment
                for current_assignment in self.variable_field
                if current_assignment.table == table_number)

        self.tables_by_player = dict()
        for player in self.player_names:
            self.tables_by_player[player] = tuple(
                current_assignment
                for current_assignment in self.variable_field
                if current_assignment.player_name == player)

        # Problem and variables
        self.problem = constraint.Problem()
        self.problem.addVariables(self.variable_field, (True, False))

        # Begin configuring constraints
        # Each person can only be at 1 table
        for person in self.player_names:
            self.problem.addConstraint(
                constraint.ExactSumConstraint(
                    1), self.tables_by_player[person])
        # Each table has a max size
        for table in self.players_by_table:
            self.problem.addConstraint(
                constraint.MaxSumConstraint(self.max_table_size),
                self.players_by_table[table])
        # Min table size
        # This needs to be a custom constraint because it's not really a
        # minimum, it's zero or at least the minimum.
        for table in self.players_by_table:
            self.problem.addConstraint(
                constraint.FunctionConstraint(
                    self.min_size_func),
                self.players_by_table[table])
        # Figure out the buddy system

    def min_size_func(self, *vars):
        return sum(vars) == 0 or sum(vars) >= self.min_table_size

if __name__ == '__main__':
    a = ConstraintMuster(10, 2)
    s = a.problem.getSolution()
    fs = tuple(x for x in s if s[x])
    print "Solution:"
    pprint(fs)
    print

    for table in a.players_by_table:
        pprint(a.players_by_table[table])
        print sum(s[x] for x in s if x.table == table)
        print
