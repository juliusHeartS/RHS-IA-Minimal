"""
    pygments.lexers.text
    ~~~~~~~~~~~~~~~~~~~~

    Lexers for non-source code file types.

    :copyright: Copyright 2006-present by the Pygments team, see AUTHORS.
    :license: BSD, see LICENSE for details.
"""

# ruff: noqa: F401
from positron._vendor.pygments.lexers.configs import ApacheConfLexer, NginxConfLexer, \
    SquidConfLexer, LighttpdConfLexer, IniLexer, RegeditLexer, PropertiesLexer, \
    UnixConfigLexer
from positron._vendor.pygments.lexers.console import PyPyLogLexer
from positron._vendor.pygments.lexers.textedit import VimLexer
from positron._vendor.pygments.lexers.markup import BBCodeLexer, MoinWikiLexer, RstLexer, \
    TexLexer, GroffLexer
from positron._vendor.pygments.lexers.installers import DebianControlLexer, DebianSourcesLexer, SourcesListLexer
from positron._vendor.pygments.lexers.make import MakefileLexer, BaseMakefileLexer, CMakeLexer
from positron._vendor.pygments.lexers.haxe import HxmlLexer
from positron._vendor.pygments.lexers.sgf import SmartGameFormatLexer
from positron._vendor.pygments.lexers.diff import DiffLexer, DarcsPatchLexer
from positron._vendor.pygments.lexers.data import YamlLexer
from positron._vendor.pygments.lexers.textfmts import IrcLogsLexer, GettextLexer, HttpLexer

__all__ = []
