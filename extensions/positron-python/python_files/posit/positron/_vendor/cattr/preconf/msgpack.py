"""Preconfigured converters for msgpack."""

from positron._vendor.cattrs.preconf.msgpack import MsgpackConverter, configure_converter, make_converter

__all__ = ["configure_converter", "make_converter", "MsgpackConverter"]
