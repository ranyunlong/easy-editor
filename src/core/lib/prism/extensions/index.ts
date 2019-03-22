import abap from './abap'
import abnf from './abnf'
import actionscript from './actionscript'
import ada from './ada'
import apacheconf from './apacheconf'
import apl from './apl'
import applescript from './applescript'
import arduino from './arduino'
import arff from './arff'
import asciidoc from './asciidoc'
import asm6502 from './asm6502'
import aspnet from './aspnet'
import autohotkey from './autohotkey'
import autoit from './autoit'
import bash from './bash'
import basic from './basic'
import batch from './batch'
import bison from './bison'
import bnf from './bnf'
import brainfuck from './brainfuck'
import bro from './bro'
import c from './c'
import cil from './cil'
import clike from './clike'
import clojure from './clojure'
import coffeescript from './coffeescript'
import cpp from './cpp'
import crystal from './crystal'
import csharp from './csharp'
import csp from './csp'
import css from './css'
import d from './d'
import dart from './dart'
import diff from './diff'
import django from './django'
import docker from './docker'
import ebnf from './ebnf'
import eiffel from './eiffel'
import ejs from './ejs'
import elixir from './elixir'
import elm from './elm'
import erb from './erb'
import erlang from './erlang'
import flow from './flow'
import fortran from './fortran'
import fsharp from './fsharp'
import gcode from './gcode'
import gedcom from './gedcom'
import gherkin from './gherkin'
import git from './git'
import glsl from './glsl'
import gml from './gml'
import go from './go'
import graphql from './graphql'
import groovy from './groovy'
import haml from './haml'
import handlebars from './handlebars'
import haskell from './haskell'
import haxe from './haxe'
import hcl from './hcl'
import hpkp from './hpkp'
import hsts from './hsts'
import http from './http'
import ichigojam from './ichigojam'
import icon from './icon'

import inform7 from './inform7'
import ini from './ini'
import io from './io'
import j from './j'
import java from './java'
import javadoc from './javadoc'
import javadoclike from './javadoclike'
import javascript from './javascript'
import javastacktrace from './javastacktrace'
import jolie from './jolie'
import jsdoc from './jsdoc'
import json from './json'
import json5 from './json5'
import jsonp from './jsonp'
import jsx from './jsx'
import julia from './julia'
import keyman from './keyman'
import kotlin from './kotlin'
import latex from './latex'
import less from './less'
import liquid from './liquid'
import lisp from './lisp'
import livescript from './livescript'
import lolcode from './lolcode'
import lua from './lua'
import makefile from './makefile'
import markdown from './markdown'
import markup from './markup'
import matlab from './matlab'
import mel from './mel'
import mizar from './mizar'
import monkey from './monkey'
import n1ql from './n1ql'
import n4js from './n4js'
import nand2tetrisHdl from './nand2tetris-hdl'
import nasm from './nasm'
import nginx from './nginx'
import nim from './nim'
import nix from './nix'
import nsis from './nsis'
import objectivec from './objectivec'
import ocaml from './ocaml'
import opencl from './opencl'
import oz from './oz'
import parigp from './parigp'
import parser from './parser'
import pascal from './pascal'
import perl from './perl'
import php from './php'
import phpdoc from './phpdoc'
import plsql from './plsql'
import powershell from './powershell'
import processing from './processing'
import prolog from './prolog'
import properties from './properties'
import protobuf from './protobuf'
import pug from './pug'
import puppet from './puppet'
import pure from './pure'
import python from './python'
import q from './q'
import qore from './qore'
import r from './r'
import reason from './reason'
import regex from './regex'

import renpy from './renpy'
import rest from './rest'
import rip from './rip'
import roboconf from './roboconf'
import ruby from './ruby'
import rust from './rust'
import sas from './sas'
import sass from './sass'
import scala from './scala'
import scheme from './scheme'
import scss from './scss'
import smalltalk from './smalltalk'
import smarty from './smarty'
import soy from './soy'
import sql from './sql'
import stylus from './stylus'
import swift from './swift'
import t4 from './t4'
import tap from './tap'
import tcl from './tcl'
import textile from './textile'
import toml from './toml'
import tsx from './tsx'
import tt2 from './tt2'
import twig from './twig'
import typescript from './typescript'
import vala from './vala'
import vbnet from './vbnet'
import velocity from './velocity'
import verilog from './verilog'
import vhdl from './vhdl'
import vim from './vim'
import visualBasic from './visual-basic'
import wasm from './wasm'
import wiki from './wiki'
import xeora from './xeora'
import xojo from './xojo'
import xquery from './xquery'
import yaml from './yaml'
import { Util } from '../core/Util';
import { Hook } from '../core/Hook';
import { Languages } from '../core/Languages';
const extensions: Extensions = {
    abap,
    abnf,
    actionscript,
    ada,
    apacheconf,
    apl,
    applescript,
    arduino,
    arff,
    asciidoc,
    asm6502,
    aspnet,
    autohotkey,
    autoit,
    bash,
    basic,
    batch,
    bison,
    bnf,
    brainfuck,
    bro,
    c,
    cil,
    clike,
    clojure,
    coffeescript,
    cpp,
    crystal,
    csharp,
    csp,
    css,
    d,
    dart,
    diff,
    django,
    docker,
    ebnf,
    eiffel,
    ejs,
    elixir,
    elm,
    erb,
    erlang,
    flow,
    fortran,
    fsharp,
    gcode,
    gedcom,
    gherkin,
    git,
    glsl,
    gml,
    go,
    graphql,
    groovy,
    haml,
    handlebars,
    haskell,
    haxe,
    hcl,
    hpkp,
    hsts,
    http,
    ichigojam,
    icon,
    inform7,
    ini,
    io,
    j,
    java,
    javadoc,
    javadoclike,
    javascript,
    javastacktrace,
    jolie,
    jsdoc,
    json,
    json5,
    jsonp,
    jsx,
    julia,
    keyman,
    kotlin,
    latex,
    less,
    liquid,
    lisp,
    livescript,
    lolcode,
    lua,
    makefile,
    markdown,
    markup,
    matlab,
    mel,
    mizar,
    monkey,
    n1ql,
    n4js,
    'nand2tetris-hdl': nand2tetrisHdl,
    nasm,
    nginx,
    nim,
    nix,
    nsis,
    objectivec,
    ocaml,
    opencl,
    oz,
    parigp,
    parser,
    pascal,
    perl,
    php,
    phpdoc,
    plsql,
    powershell,
    processing,
    prolog,
    properties,
    protobuf,
    pug,
    puppet,
    pure,
    python,
    q,
    qore,
    r,
    reason,
    regex,
    renpy,
    rest,
    rip,
    roboconf,
    ruby,
    rust,
    sas,
    sass,
    scala,
    scheme,
    scss,
    smalltalk,
    smarty,
    soy,
    sql,
    stylus,
    swift,
    t4,
    tap,
    tcl,
    textile,
    toml,
    tsx,
    tt2,
    twig,
    typescript,
    vala,
    vbnet,
    velocity,
    verilog,
    vhdl,
    vim,
    'visual-basic': visualBasic,
    wasm,
    wiki,
    xeora,
    xojo,
    xquery,
    yaml
}

export interface Extensions {
    [key: string]: (languages: Languages, hooks: Hook, util: Util) => void;
}

export default extensions;