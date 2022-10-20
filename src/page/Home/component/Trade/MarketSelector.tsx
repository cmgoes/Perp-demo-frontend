import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import React, { useCallback, useEffect, useMemo } from "react"
import { Amm as AmmType } from "constant/amm"
import { Amm } from "container/amm"

function MarketSelector() {
    const NFTList = ["Azuki", "Bored Ape Yacht Club", "Cryptopunks"];
    const { isLoading: isLoadingAmmMap, ammMap, setSelectedAmm } = Amm.useContainer();
    console.log("Load", Amm.useContainer());

    const sortedAmmList = useMemo(() => {
        if (!ammMap) {
            return []
        }
        return Object.values(ammMap).slice(0, 3).sort((a, b) => a.baseAssetSymbol.localeCompare(b.baseAssetSymbol))
    }, [ammMap])

    useEffect(() => {
        /* use local storage to impl setDefaultSelectedAmm would be better */
        function setDefaultSelectedAmm() {
            setSelectedAmm(sortedAmmList[0])
        }
        if (sortedAmmList && sortedAmmList.length > 0) {
            setDefaultSelectedAmm()
        }
    }, [setSelectedAmm, sortedAmmList])

    const handleOnChange = useCallback(
        e => {
            const index = e.target.value
            setSelectedAmm(sortedAmmList[index])
        },
        [sortedAmmList, setSelectedAmm],
    )

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange} isDisabled={isLoadingAmmMap}>
                {sortedAmmList.map((amm: AmmType, index: number) => (
                    <option key={`${amm.baseAssetSymbol}-${amm.quoteAssetSymbol}`} value={index}>
                        {NFTList[index]} / ETH
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
