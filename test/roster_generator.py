"""Tools for generating pseudo-random rosters to test mustering."""

import csv
import random



class RosterGenerator():
    """A class for generating pseudo-random rosters to test mustering.

    This class contains information on the names used to generate the rosters,
    by default this information is drawn from 'forenames.csv' and
    'surnames.csv' in the same folder.
    """

    def __init__(self):
        """Initialize a RosterGenerator."""
        with open('forenames.csv', newline='') as forename_file, \
                open('surnames.csv', newline='') as surname_file:
                # HACK: I really don't like using backslash line continuation.
            forename_reader = csv.reader(forename_file)
            surname_reader = csv.reader(surname_file)
            self.forenames = sorted(
                set(forename[0] for forename in forename_reader))
            self.surnames = sorted(
                set(surname[0] for surname in surname_reader))

    def generate_player_names(self, num_players):
        """Generate a list of num_players unique random names.

        Note that this isn't implemented with efficiency in mind.
        Using Random.sample() in a generator would probably be faster,
        although a loop would still be required to deal with the possibility
        of randomly selected duplicates.
        """
        players = set()
        while len(players) < num_players:
            forename_number = random.randrange(len(self.forenames))
            surname_number = random.randrange(len(self.surnames))
            players.add((
                self.forenames[forename_number],
                self.surnames[surname_number],))
        return players

    def generate_player_groups(self, num_players, max_group_size):
        """Randomly create, assign num_players to groups up to max_group_size.

        This is to simulate the buddy system during muster.
        """
        players = list(self.generate_player_names(num_players))
        groups = list()
        while players:
            new_group = players[:random.randint(1, max_group_size)]
            players[:len(new_group)] = []
            groups.append(tuple(new_group))
        return tuple(groups)
