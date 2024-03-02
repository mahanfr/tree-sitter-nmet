
const default_types = [
    "int", "i32",
    "uint", "u32",
    "ulong", "u64",
    "long", "i64",
    "char", "u8",
    "void", "bool",
    "str", "ptr",
    "float", "f",
];

const TOKEN_TREE_NON_SPECIAL_TOKENS = [
    "+=", "-=", "*=",
    "/=", "%=", "==",
    ":=", "::", "!=",
    ">=", "<=", "<<",
    ">>", "||", "&&",
];

module.exports = grammar({
    name: 'nmet',
    
    extras: $ => [
        /\s/,
        $.comment,
    ],

    rules: {
        source_file: $ => seq(
            repeat($.statement),
        ),

        statement: $ => seq(
            choice(
                $.comment,
                $.function_item,
            ),
        ),

        comment: _ => seq(
            '~',
            token.immediate(prec(1, /.*/)),
        ), 

        type: $ => seq(
            '@',
            choice(
                $.ident,
                choice(...default_types),
            ),
        ),

        parameters: $ => seq(
            '(',
            sepBy(',', seq(
                $.ident,
                $.type,
            )),
            ')',
        ),

        ident: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,

        function_item: $ => seq(
            'func',
            $.ident,
            $.parameters,
            optional(seq('->', $.type)),
            optional($.block),
            optional(';'),
        ),

        block: $ => seq(
            '{',
            optional(choice(
                $.statement,
            )),
            '}',
        ),
    }
});

function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
