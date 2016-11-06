

    // var setHp = function(_profile, _vessel){
    //     _profile.hp = _vessel.P.op / (_vessel.sg * 9.8);
    //     return _profile.hp;
    // }

    // var setHs = function(_profile, _vessel){
    //     _profile.hs = _vessel.L.op - system.pump.elevation;
    //     return _profile.hs;
    // }

    // var setInnerDia = function(_pipe){
    //     _pipe.innerDia = pipeTable[_pipe.nps][_pipe.sch] / 1000;

    //     return _pipe.innerDia;

    // }

    var setHfPipe = function(_profile, _pipe, _vessel){
        _profile.velocity = _pipe.flow_sf / (Math.pow(_pipe.innerDia,2) * (Math.PI / 4)) / 3600;
        _profile.hv = Math.pow(_profile.velocity, 2) / (2 * 9.8);
        _profile.ed = _pipe.roughness / _pipe.innerDia;
        _profile.Re = _profile.velocity * _pipe.innerDia * _vessel.sg * 1000 / system.pump.viscosity;

        var A = -2 * Math.log10((_profile.ed / 3.7) + (12 / _profile.Re));
        var B = -2 * Math.log10((_profile.ed / 3.7) + (2.51 * A / _profile.Re));
        var C = -2 * Math.log10((_profile.ed / 3.7) + (2.51 * B / _profile.Re));
        _profile.friction = Math.pow(((A - Math.pow((B-A), 2)) / (C - (2 * B) + A)), -2);

        _profile.LD = +_pipe.length / _pipe.innerDia;

        _profile.hfPipe = _profile.friction * _profile.hv * _profile.LD;

    }
