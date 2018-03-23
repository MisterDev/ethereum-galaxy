import * as React from 'react'
import { css, StyleSheet } from 'aphrodite'
import { MdGpsFixed } from 'react-icons/lib/md' // TODO change icon

import Button from '../Button'
import { getJson } from '../../utils/xhr'

const styles = StyleSheet.create({
    searchResultContainer: {
        width: '100%',
        maxHeight: 500,
        background: 'rgba( 255, 255, 255, .6 )',
        fontFamily: 'sans-serif',
        color: '#333',
        padding: '1px 0px'
    },
    card: {
        margin: 12,
        background: 'rgba(256, 256, 256, .4)',
        padding: 20
    },
    cardHeader: {
        fontSize: 17.5,
        marginBottom: 18,
        display: 'flex',
        flexDirection: 'column'
    },
    cardGroup: {
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column'
    },
    cardGroupHeader: {
        fontSize: 17,
        fontWeight: 600,
        marginBottom: 8
    },
    cardRow: {
        height: 24
    },
    placeholder: {
        fontWeight: 600,
        textAlign: 'center'
    }
})

interface SearchResultProps {
    address: string
    getNodeInfo: (address: string) => any
    focusOnNode: (nodeId: number) => void
}

interface SearchResultState {
    address: string
    result: any
}

class SearchResult extends React.Component<
    SearchResultProps,
    SearchResultState
> {
    constructor(props: SearchResultProps) {
        super(props)
        this.state = {
            address: props.address,
            result: undefined
        }
    }

    getInfo(address: string) {
        getJson(
            `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
        ).then((result: any) => {
            this.setState({
                result
            })
        })
    }

    componentWillReceiveProps(newProps: SearchResultProps) {
        if (newProps.address !== this.state.address) {
            this.setState({
                address: newProps.address
            })
            if (newProps.address !== '') this.getInfo(newProps.address)
        }
    }

    render() {
        const { result, address } = this.state
        let countTxs = 0
        let type = 'Address'

        if (address === '') {
            return null
        }
        let nodeInfo = this.props.getNodeInfo(address)
        // TODO
        if (result && !result.error) {
            if (result.contractInfo) {
                type = 'Contract'
            }
            if (result) {
                countTxs = result.countTxs
            }
        }

        return result && !result.error ? (
            <div className={css(styles.searchResultContainer)}>
                {!nodeInfo ? (
                    <div className={css(styles.card)}>
                        <div className={css(styles.placeholder)}>
                            Address not found in this graph
                        </div>
                    </div>
                ) : (
                    <div className={css(styles.card)}>
                        <div className={css(styles.cardGroup)}>
                            <div className={css(styles.cardRow)}>
                                Locate this address
                                <Button
                                    icon={<MdGpsFixed />}
                                    onClick={() =>
                                        this.props.focusOnNode(nodeInfo.id)
                                    }
                                />
                            </div>
                        </div>
                        <div className={css(styles.cardGroup)}>
                            <div className={css(styles.cardGroupHeader)}>
                                {nodeInfo.inLinks.length +
                                    nodeInfo.outLinks.length}{' '}
                                transactions in this graph
                            </div>
                            <div className={css(styles.cardRow)}>
                                {`In:   ${nodeInfo.inLinks.length}`}
                            </div>
                            <div className={css(styles.cardRow)}>
                                {`Out:  ${nodeInfo.outLinks.length}`}
                            </div>
                        </div>
                    </div>
                )}
                <div className={css(styles.card)}>
                    <div className={css(styles.cardHeader)}>
                        <b>General Overview</b>
                    </div>
                    <div className={css(styles.cardGroup)}>
                        <div className={css(styles.cardGroupHeader)}>
                            <b>{type}</b>
                        </div>
                        <div className={css(styles.cardRow)}>
                            <div>{result.address}</div>
                        </div>
                    </div>
                    <div className={css(styles.cardGroup)}>
                        <div className={css(styles.cardGroupHeader)}>
                            <b>Balance</b>
                        </div>
                        <div className={css(styles.cardRow)}>
                            {` ${result.ETH && result.ETH.balance} ETH`}
                        </div>
                    </div>
                    <div className={css(styles.cardGroup)}>
                        <div className={css(styles.cardGroupHeader)}>
                            {countTxs} total transactions
                        </div>
                        <div className={css(styles.cardRow)}>
                            {`Total In:   ${result.ETH &&
                                result.ETH.totalIn} ETH`}
                        </div>
                        <div className={css(styles.cardRow)}>
                            {`Total Out:  ${result.ETH &&
                                result.ETH.totalOut} ETH`}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className={css(styles.searchResultContainer)}>
                <div className={css(styles.card)}>
                    <div className={css(styles.placeholder)}>
                        {result && result.error
                            ? 'Address not found'
                            : 'Searching Address...'}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchResult
