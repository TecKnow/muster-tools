#!/usr/bin/env python2
"""Use a pure Python constraint solver to explore table assignments.

The particular interest is in exploring the impact of allowing larger
groups of players to sign up together.
"""
import collections
import constraint
import itertools
import math
import logging
from pprint import pprint, pformat
from muster.test.roster_generator import RosterGenerator

logging.basicConfig(level=logging.DEBUG)

_logger = logging.getLogger(__name__)

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
    """Generates sample sign-ups and constraints for table assignment."""

    def __init__(self,
                 num_players,
                 max_group_size,
                 min_table_size=None,
                 max_table_size=None):
        """Generate a sample sign up and configure table parameters.

        num_players:  How many players to randomly generate
        max_group_size: Players will alloted in groups of up to this size.
        min_table_size:  Optional, default is 3
        max_table_size:  Optional, default is 7
    """
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
                float(num_players) / self.min_table_size))

        # Create the variable names and group them up.
        # Player variables
        self.problem = constraint.Problem()
        self.problem.addVariables(
            self.player_names, range(1, self.max_tables + 1))

        # Begin configuring constraints
        # Each table has a max size
        self.problem.addConstraint(self.max_size_func)
        # Min table size
        # This needs to be a custom constraint because it's not really a
        # minimum, it's zero or at least the minimum.
        # Consider buddy requests.

    def min_size_func(self, *vars):
        """Function for minimum table size constraint"""
        pass


    def max_size_func(self, *vars):
        """Function for enforcing table maximum sizes."""
        _logger.debug(vars)

if __name__ == '__main__':
    a = ConstraintMuster(40, 2)
    _logger.info(pformat(a.player_groups))
    ss = a.problem.getSolutions()
    print "Number of solutions found", len(ss)
