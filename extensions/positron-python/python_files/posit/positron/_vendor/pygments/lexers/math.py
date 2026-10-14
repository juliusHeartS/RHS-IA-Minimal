"""
    pygments.lexers.math
    ~~~~~~~~~~~~~~~~~~~~

    Just export lexers that were contained in this module.

    :copyright: Copyright 2006-present by the Pygments team, see AUTHORS.
    :license: BSD, see LICENSE for details.
"""

# ruff: noqa: F401
from positron._vendor.pygments.lexers.python import NumPyLexer
from positron._vendor.pygments.lexers.matlab import MatlabLexer, MatlabSessionLexer, \
    OctaveLexer, ScilabLexer
from positron._vendor.pygments.lexers.julia import JuliaLexer, JuliaConsoleLexer
from positron._vendor.pygments.lexers.r import RConsoleLexer, SLexer, RdLexer
from positron._vendor.pygments.lexers.modeling import BugsLexer, JagsLexer, StanLexer
from positron._vendor.pygments.lexers.idl import IDLLexer
from positron._vendor.pygments.lexers.algebra import MuPADLexer

__all__ = []
